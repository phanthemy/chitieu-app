import { useState, useMemo } from 'react'
import TransactionCard from '../components/TransactionCard'
import MonthPicker from '../components/MonthPicker'
import './TransactionList.css'

const formatMoney = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

const CATEGORIES = [
  { value: '', label: 'Tất cả danh mục' },
  { value: 'salary', label: '💰 Lương' },
  { value: 'freelance', label: '💻 Freelance' },
  { value: 'food', label: '🍜 Ăn uống' },
  { value: 'transport', label: '🚗 Đi lại' },
  { value: 'rent', label: '🏠 Nhà ở' },
  { value: 'shopping', label: '🛍️ Mua sắm' },
  { value: 'bills', label: '💡 Hóa đơn' },
  { value: 'health', label: '💊 Sức khỏe' },
  { value: 'entertainment', label: '🎮 Giải trí' },
  { value: 'other', label: '📦 Khác' },
]

export default function TransactionList({ transactions = [], onDelete, navigate, period, onPeriodChange }) {
  const [filterType, setFilterType] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('date-desc')
  
  // Custom date range state
  const [isCustomRange, setIsCustomRange] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filteredTransactions = useMemo(() => {
    let result = [...transactions]

    // 1. Time filter
    if (isCustomRange) {
      if (startDate) {
        result = result.filter(t => t.date && t.date >= startDate)
      }
      if (endDate) {
        result = result.filter(t => t.date && t.date <= endDate)
      }
    } else if (period && !period.allTime) {
      result = result.filter(t => {
        if (!t.date) return false
        const parts = t.date.split('-')
        if (parts.length >= 2) {
          const y = parseInt(parts[0], 10)
          const m = parseInt(parts[1], 10)
          return y === period.year && m === period.month
        }
        const d = new Date(t.date)
        return d.getFullYear() === period.year && (d.getMonth() + 1) === period.month
      })
    }

    // 2. Filter by type
    if (filterType) {
      result = result.filter(t => t.type === filterType)
    }

    // 3. Filter by category
    if (filterCategory) {
      result = result.filter(t => t.category === filterCategory)
    }

    // 4. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(t => 
        (t.note && t.note.toLowerCase().includes(q)) ||
        (t.categoryName && t.categoryName.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
      )
    }

    // 5. Sort
    switch (sortBy) {
      case 'date-desc':
        result.sort((a, b) => new Date(b.date) - new Date(a.date))
        break
      case 'date-asc':
        result.sort((a, b) => new Date(a.date) - new Date(b.date))
        break
      case 'amount-desc':
        result.sort((a, b) => b.amount - a.amount)
        break
      case 'amount-asc':
        result.sort((a, b) => a.amount - b.amount)
        break
      default:
        break
    }

    return result
  }, [transactions, period, isCustomRange, startDate, endDate, filterType, filterCategory, searchQuery, sortBy])

  const summary = useMemo(() => {
    const income = filteredTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const expense = filteredTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    return { income, expense, count: filteredTransactions.length }
  }, [filteredTransactions])

  // Group by date
  const groupedTransactions = useMemo(() => {
    const groups = {}
    filteredTransactions.forEach(tx => {
      const dateKey = tx.date || 'Chưa rõ ngày'
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(tx)
    })
    return Object.entries(groups).sort((a, b) => new Date(b[0]) - new Date(a[0]))
  }, [filteredTransactions])

  const formatDateLabel = (dateStr) => {
    if (!dateStr || dateStr === 'Chưa rõ ngày') return 'Chưa rõ ngày'
    const date = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (date.toDateString() === today.toDateString()) return 'Hôm nay'
    if (date.toDateString() === yesterday.toDateString()) return 'Hôm qua'
    return date.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const periodLabel = isCustomRange
    ? (startDate || endDate ? `Từ ${startDate || '...'} đến ${endDate || '...'}` : 'Tùy chọn khoảng ngày')
    : (period?.allTime ? 'Tất cả thời gian' : `Tháng ${String(period?.month || '').padStart(2, '0')}/${period?.year || ''}`)

  return (
    <div className="tx-list-page">
      <div className="page-header animate-fade-in-up">
        <div className="tx-list-header-row">
          <div>
            <h1>Giao dịch</h1>
            <p>{periodLabel} • Quản lý và theo dõi thu chi</p>
          </div>
          <div className="tx-header-actions">
            {period && onPeriodChange && !isCustomRange && (
              <MonthPicker period={period} onChange={onPeriodChange} />
            )}
            <button className="btn btn-primary" onClick={() => navigate('/add')}>
              ➕ Thêm giao dịch
            </button>
          </div>
        </div>
      </div>

      {/* Filter Stats */}
      <div className="tx-list-stats animate-fade-in-up stagger-children">
        <div className="tx-stat-card glass-card">
          <span className="tx-stat-icon">📋</span>
          <div>
            <div className="tx-stat-value">{summary.count}</div>
            <div className="tx-stat-label">Giao dịch ({periodLabel})</div>
          </div>
        </div>
        <div className="tx-stat-card glass-card">
          <span className="tx-stat-icon">📈</span>
          <div>
            <div className="tx-stat-value" style={{ color: 'var(--accent-success)' }}>+{formatMoney(summary.income)}</div>
            <div className="tx-stat-label">Tổng thu nhập</div>
          </div>
        </div>
        <div className="tx-stat-card glass-card">
          <span className="tx-stat-icon">📉</span>
          <div>
            <div className="tx-stat-value" style={{ color: 'var(--accent-danger)' }}>-{formatMoney(summary.expense)}</div>
            <div className="tx-stat-label">Tổng chi tiêu</div>
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="tx-filters glass-card animate-fade-in-up">
        <div className="tx-search-wrapper">
          <span className="tx-search-icon">🔍</span>
          <input
            type="text"
            className="form-input tx-search-input"
            placeholder="Tìm kiếm theo ghi chú, danh mục..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Date Filter Bar */}
        <div className="tx-date-filter-bar">
          <div className="date-mode-toggle">
            <button
              type="button"
              className={`date-mode-btn ${!isCustomRange ? 'active' : ''}`}
              onClick={() => setIsCustomRange(false)}
            >
              📅 Theo tháng
            </button>
            <button
              type="button"
              className={`date-mode-btn ${isCustomRange ? 'active' : ''}`}
              onClick={() => setIsCustomRange(true)}
            >
              📆 Khoảng ngày
            </button>
          </div>

          {isCustomRange && (
            <div className="custom-date-inputs animate-fade-in">
              <div className="date-input-group">
                <span className="date-input-label">Từ:</span>
                <input
                  type="date"
                  className="form-input date-field"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="date-input-group">
                <span className="date-input-label">Đến:</span>
                <input
                  type="date"
                  className="form-input date-field"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              {(startDate || endDate) && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setStartDate(''); setEndDate('') }}
                >
                  ✕ Xóa lọc
                </button>
              )}
            </div>
          )}
        </div>

        <div className="tx-filter-row">
          <div className="tx-type-filter">
            <button 
              className={`tx-type-btn ${filterType === '' ? 'active' : ''}`}
              onClick={() => setFilterType('')}
            >
              Tất cả
            </button>
            <button 
              className={`tx-type-btn tx-type-income ${filterType === 'income' ? 'active' : ''}`}
              onClick={() => setFilterType('income')}
            >
              📈 Thu nhập
            </button>
            <button 
              className={`tx-type-btn tx-type-expense ${filterType === 'expense' ? 'active' : ''}`}
              onClick={() => setFilterType('expense')}
            >
              📉 Chi tiêu
            </button>
          </div>

          <div className="tx-filter-selects">
            <select
              className="form-select tx-filter-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>

            <select
              className="form-select tx-filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Mới nhất trước</option>
              <option value="date-asc">Cũ nhất trước</option>
              <option value="amount-desc">Số tiền giảm dần</option>
              <option value="amount-asc">Số tiền tăng dần</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="tx-groups">
        {groupedTransactions.length === 0 ? (
          <div className="empty-state glass-card animate-fade-in">
            <div className="empty-state-icon">🔍</div>
            <h3>Không tìm thấy giao dịch nào</h3>
            <p>Không có giao dịch trong {periodLabel.toLowerCase()} khớp với điều kiện lọc</p>
          </div>
        ) : (
          groupedTransactions.map(([dateKey, txs]) => (
            <div className="tx-group animate-fade-in-up" key={dateKey}>
              <div className="tx-group-header">
                <span className="tx-group-date">{formatDateLabel(dateKey)}</span>
                <span className="tx-group-count">{txs.length} giao dịch</span>
              </div>
              <div className="tx-group-list glass-card">
                {txs.map((tx, i) => (
                  <TransactionCard 
                    key={tx.id} 
                    transaction={tx} 
                    onDelete={onDelete}
                    style={{ animationDelay: `${i * 0.05}s` }}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

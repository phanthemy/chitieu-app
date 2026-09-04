import { useState, useMemo } from 'react'
import { ProgressBar } from '../components/Chart'
import MonthPicker from '../components/MonthPicker'
import './BudgetPage.css'

const formatMoney = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

const KNOWN_EXPENSE_CATEGORIES = ['food', 'transport', 'shopping', 'bills', 'health', 'entertainment', 'rent']

export default function BudgetPage({ budgets = [], transactions = [], onUpdateBudget, period, onPeriodChange }) {
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3000)
  }

  // Calculate spent in the selected month
  const budgetData = useMemo(() => {
    return budgets.map(budget => {
      const spent = transactions
        .filter(t => {
          if (t.type !== 'expense') return false
          
          // Match category: if 'other', also include uncategorized / misc expenses
          const isMatch = t.category === budget.category || 
            (budget.category === 'other' && (
              !t.category || 
              t.category === 'other' || 
              t.category === 'Khác' || 
              t.category === 'Khác (Chi)' || 
              t.category === 'Chi tiêu khác' ||
              !KNOWN_EXPENSE_CATEGORIES.includes(t.category)
            ))
            
          if (!isMatch) return false
          if (!period || period.allTime) return true
          const parts = t.date?.split('-')
          if (parts && parts.length >= 2) {
            return parseInt(parts[0], 10) === period.year && parseInt(parts[1], 10) === period.month
          }
          return true
        })
        .reduce((sum, t) => sum + t.amount, 0)

      const percent = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0
      const remaining = budget.limit - spent
      const isOver = spent > budget.limit

      return {
        ...budget,
        spent,
        percent,
        remaining,
        isOver,
      }
    })
  }, [budgets, transactions, period])

  const totalBudget = useMemo(() => budgets.reduce((s, b) => s + b.limit, 0), [budgets])
  const totalSpent = useMemo(() => budgetData.reduce((s, b) => s + b.spent, 0), [budgetData])
  const totalRemaining = totalBudget - totalSpent

  const handleEdit = (budget) => {
    setEditingId(budget.id)
    setEditValue(budget.limit.toString())
  }

  const handleSave = (id) => {
    const val = parseFloat(editValue)
    if (!isNaN(val) && val >= 0) {
      onUpdateBudget(id, val)
      showToast('Đã lưu hạn mức ngân sách thành công!')
    }
    setEditingId(null)
  }

  const periodTitle = period?.allTime
    ? 'Toàn bộ thời gian'
    : `Tháng ${String(period?.month || new Date().getMonth() + 1).padStart(2, '0')}/${period?.year || new Date().getFullYear()}`

  return (
    <div className="budget-page">
      {toastMessage && (
        <div className="budget-toast animate-scale-in">
          {toastMessage}
        </div>
      )}

      {/* Header with MonthPicker */}
      <div className="page-header budget-header animate-fade-in-up">
        <div>
          <h1>Ngân sách chi tiêu</h1>
          <p>{periodTitle} • Thiết lập và theo dõi hạn mức chi tiêu</p>
        </div>
        {period && onPeriodChange && (
          <MonthPicker period={period} onChange={onPeriodChange} />
        )}
      </div>

      {/* Overall Budget Summary */}
      <div className="budget-overview glass-card animate-fade-in-up">
        <div className="budget-overview-inner">
          <div className="budget-overview-visual">
            <div className="budget-circle">
              <svg viewBox="0 0 120 120" className="budget-ring">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="none"
                  stroke="url(#budgetGrad)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 327, 327) : 0} 327`}
                  transform="rotate(-90 60 60)"
                  className="budget-ring-fill"
                />
                <defs>
                  <linearGradient id="budgetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6c5ce7" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="budget-circle-text">
                <span className="budget-circle-percent">
                  {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%
                </span>
                <span className="budget-circle-label">đã dùng</span>
              </div>
            </div>
          </div>

          <div className="budget-overview-stats">
            <div className="budget-overview-stat">
              <span className="budget-stat-dot" style={{ background: 'var(--accent-primary)' }} />
              <div>
                <div className="budget-stat-label">Tổng hạn mức</div>
                <div className="budget-stat-value">{formatMoney(totalBudget)}</div>
              </div>
            </div>
            <div className="budget-overview-stat">
              <span className="budget-stat-dot" style={{ background: 'var(--accent-danger)' }} />
              <div>
                <div className="budget-stat-label">Đã chi ({periodTitle})</div>
                <div className="budget-stat-value" style={{ color: 'var(--accent-danger)' }}>
                  {formatMoney(totalSpent)}
                </div>
              </div>
            </div>
            <div className="budget-overview-stat">
              <span className="budget-stat-dot" style={{ background: 'var(--accent-success)' }} />
              <div>
                <div className="budget-stat-label">Còn lại</div>
                <div className="budget-stat-value" style={{ color: totalRemaining >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                  {formatMoney(Math.abs(totalRemaining))}
                  {totalRemaining < 0 && ' (vượt)'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Cards Grid */}
      <div className="budget-cards stagger-children">
        {budgetData.map((budget, i) => (
          <div 
            key={budget.id} 
            className={`budget-card glass-card animate-fade-in-up ${budget.isOver ? 'budget-card-over' : ''}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="budget-card-header">
              <div className="budget-card-info">
                <span className="budget-card-icon" style={{ background: `${budget.color}20` }}>
                  {budget.icon}
                </span>
                <div>
                  <h3 className="budget-card-title">{budget.label}</h3>
                  <span className={`badge ${budget.isOver ? 'badge-expense' : 'badge-income'}`}>
                    {budget.isOver ? '⚠️ Vượt hạn mức' : `${Math.round(budget.percent)}% đã dùng`}
                  </span>
                </div>
              </div>
              
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => editingId === budget.id ? handleSave(budget.id) : handleEdit(budget)}
              >
                {editingId === budget.id ? '💾 Lưu' : '✏️ Sửa'}
              </button>
            </div>

            {editingId === budget.id ? (
              <div className="budget-edit animate-scale-in">
                <label className="form-label">Hạn mức mới (VND)</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                  <input
                    type="number"
                    className="form-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave(budget.id)
                      if (e.key === 'Escape') setEditingId(null)
                    }}
                    min="0"
                    step="50000"
                    placeholder="Nhập số tiền..."
                    autoFocus
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => handleSave(budget.id)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    💾 Lưu
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setEditingId(null)}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    ✕ Hủy
                  </button>
                </div>
                {editValue && !isNaN(editValue) && parseFloat(editValue) > 0 && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', marginTop: '6px' }}>
                    Xem trước: <strong>{formatMoney(parseFloat(editValue))}</strong>
                  </div>
                )}
              </div>
            ) : (
              <div className="budget-card-body">
                <ProgressBar 
                  value={budget.spent} 
                  max={budget.limit} 
                  color={budget.color}
                  height={10}
                />
                <div className="budget-card-footer">
                  <span className="budget-remaining">
                    {budget.isOver ? (
                      <span style={{ color: 'var(--accent-danger)' }}>
                        Vượt {formatMoney(Math.abs(budget.remaining))}
                      </span>
                    ) : (
                      <>Còn lại: <strong>{formatMoney(budget.remaining)}</strong></>
                    )}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tips section */}
      <div className="budget-tips glass-card animate-fade-in-up">
        <h3>💡 Mẹo quản lý tài chính</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <span className="tip-icon">📐</span>
            <h4>Quy tắc 50/30/20</h4>
            <p>50% cho nhu cầu thiết yếu, 30% cho mong muốn, 20% cho tiết kiệm</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📊</span>
            <h4>Theo dõi hàng ngày</h4>
            <p>Ghi chép chi tiêu ngay khi phát sinh để không bỏ sót</p>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🎯</span>
            <h4>Đặt mục tiêu</h4>
            <p>Thiết lập ngân sách hợp lý và tuân thủ hạn mức đã đặt</p>
          </div>
        </div>
      </div>
    </div>
  )
}

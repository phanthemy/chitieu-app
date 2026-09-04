import { useMemo, useRef, useEffect, useState } from 'react'
import { DonutChart, BarChart, Sparkline } from '../components/Chart'
import TransactionCard from '../components/TransactionCard'
import MonthPicker from '../components/MonthPicker'
import './Dashboard.css'

const formatMoney = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

const KNOWN_EXPENSE_CATEGORIES = ['food', 'transport', 'shopping', 'bills', 'health', 'entertainment', 'rent']

export default function Dashboard({ transactions = [], budgets = [], navigate, period, onPeriodChange }) {
  const chartContainerRef = useRef(null)
  const [chartSize, setChartSize] = useState(180)

  useEffect(() => {
    const updateSize = () => {
      if (chartContainerRef.current) {
        const width = chartContainerRef.current.offsetWidth
        setChartSize(width < 320 ? 140 : 180)
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [])

  // Filter transactions based on selected period
  const filteredTransactions = useMemo(() => {
    if (!transactions || !Array.isArray(transactions)) return []
    if (!period || period.allTime) return transactions

    return transactions.filter(t => {
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
  }, [transactions, period])

  const stats = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpense
    const txCount = filteredTransactions.length

    return { totalIncome, totalExpense, balance, txCount }
  }, [filteredTransactions])

  const expenseByCategory = useMemo(() => {
    const map = {}
    const colors = {
      food: '#ff6b6b',
      transport: '#ffa726',
      rent: '#3867d6',
      shopping: '#a855f7',
      bills: '#00cec9',
      health: '#26de81',
      entertainment: '#f368e0',
      other: '#e84393',
    }
    const labels = {
      food: 'Ăn uống',
      transport: 'Đi lại',
      rent: 'Nhà ở',
      shopping: 'Mua sắm',
      bills: 'Hóa đơn',
      health: 'Sức khỏe',
      entertainment: 'Giải trí',
      other: 'Chi tiêu khác',
    }
    
    filteredTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const catKey = labels[t.category] ? t.category : 'other'
        map[catKey] = (map[catKey] || 0) + t.amount
      })

    return Object.entries(map).map(([key, value]) => ({
      label: labels[key] || key,
      value,
      color: colors[key] || '#e84393',
    })).sort((a, b) => b.value - a.value)
  }, [filteredTransactions])

  // Dynamic weekly / day-of-week data for bar chart
  const weeklyData = useMemo(() => {
    const days = [
      { label: 'T2', dayIndex: 1, income: 0, expense: 0 },
      { label: 'T3', dayIndex: 2, income: 0, expense: 0 },
      { label: 'T4', dayIndex: 3, income: 0, expense: 0 },
      { label: 'T5', dayIndex: 4, income: 0, expense: 0 },
      { label: 'T6', dayIndex: 5, income: 0, expense: 0 },
      { label: 'T7', dayIndex: 6, income: 0, expense: 0 },
      { label: 'CN', dayIndex: 0, income: 0, expense: 0 },
    ]
    filteredTransactions.forEach(t => {
      const d = new Date(t.date)
      const day = d.getDay()
      const target = days.find(x => x.dayIndex === day)
      if (target) {
        if (t.type === 'income') target.income += t.amount
        else if (t.type === 'expense') target.expense += t.amount
      }
    })
    return days.map(({ label, income, expense }) => ({ label, income, expense }))
  }, [filteredTransactions])

  // Sparkline data
  const balanceHistory = [stats.totalIncome * 0.3, stats.totalIncome * 0.6, stats.balance]
  const expenseHistory = [stats.totalExpense * 0.4, stats.totalExpense * 0.7, stats.totalExpense]

  const recentTransactions = filteredTransactions.slice(0, 5)

  const periodTitle = period?.allTime
    ? 'Toàn bộ thời gian'
    : `Tháng ${String(period?.month || new Date().getMonth() + 1).padStart(2, '0')}/${period?.year || new Date().getFullYear()}`

  return (
    <div className="dashboard">
      {/* Page Header with Time Filter */}
      <div className="page-header dashboard-header animate-fade-in-up">
        <div className="header-titles">
          <h1>Tổng quan tài chính</h1>
          <p>{periodTitle} • {stats.txCount} giao dịch ghi nhận</p>
        </div>
        {period && onPeriodChange && (
          <MonthPicker period={period} onChange={onPeriodChange} className="dashboard-month-picker" />
        )}
      </div>

      {/* Summary Cards */}
      <div className="dashboard-summary stagger-children">
        <div className="summary-card glass-card animate-fade-in-up">
          <div className="summary-top">
            <span className="summary-icon summary-icon-balance">💰</span>
            <Sparkline data={balanceHistory} color="#6c5ce7" width={80} height={32} />
          </div>
          <div className="summary-value gradient-text">
            {formatMoney(stats.balance)}
          </div>
          <div className="summary-label">Số dư {period?.allTime ? 'toàn kỳ' : 'kỳ này'}</div>
        </div>

        <div className="summary-card glass-card animate-fade-in-up">
          <div className="summary-top">
            <span className="summary-icon summary-icon-income">📈</span>
            <Sparkline data={[5000000, 8000000, 12000000, 15000000, 14000000, 16000000, stats.totalIncome]} color="#26de81" width={80} height={32} />
          </div>
          <div className="summary-value gradient-text-income">
            +{formatMoney(stats.totalIncome)}
          </div>
          <div className="summary-label">Tổng thu nhập</div>
        </div>

        <div className="summary-card glass-card animate-fade-in-up">
          <div className="summary-top">
            <span className="summary-icon summary-icon-expense">📉</span>
            <Sparkline data={expenseHistory} color="#ff6b6b" width={80} height={32} />
          </div>
          <div className="summary-value gradient-text-expense">
            -{formatMoney(stats.totalExpense)}
          </div>
          <div className="summary-label">Tổng chi tiêu</div>
        </div>

        <div className="summary-card glass-card animate-fade-in-up">
          <div className="summary-top">
            <span className="summary-icon summary-icon-count">📋</span>
          </div>
          <div className="summary-value" style={{ color: 'var(--accent-secondary)' }}>
            {stats.txCount}
          </div>
          <div className="summary-label">Giao dịch {period?.allTime ? 'tất cả' : 'tháng này'}</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="dashboard-charts">
        <div className="chart-card glass-card animate-fade-in-up">
          <div className="chart-card-header">
            <h3>📊 Thu chi theo ngày trong tuần</h3>
          </div>
          <BarChart data={weeklyData} height={220} />
        </div>

        <div className="chart-card glass-card animate-fade-in-up" ref={chartContainerRef}>
          <div className="chart-card-header">
            <h3>🍩 Chi tiêu theo danh mục</h3>
          </div>
          <DonutChart 
            data={expenseByCategory}
            size={chartSize}
            centerLabel="Tổng chi"
            centerValue={formatMoney(stats.totalExpense)}
          />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="dashboard-recent glass-card animate-fade-in-up">
        <div className="recent-header">
          <h3>⏰ Giao dịch trong kỳ</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/transactions')}>
            Xem tất cả →
          </button>
        </div>
        {recentTransactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
            Chưa có giao dịch nào trong {periodTitle.toLowerCase()}.
          </div>
        ) : (
          <div className="recent-list stagger-children">
            {recentTransactions.map((tx, i) => (
              <TransactionCard 
                key={tx.id} 
                transaction={tx}
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Budget Quick View */}
      <div className="dashboard-budget-preview glass-card animate-fade-in-up">
        <div className="recent-header">
          <h3>💎 Ngân sách {period?.allTime ? 'toàn kỳ' : 'tháng này'}</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/budget')}>
            Chi tiết →
          </button>
        </div>
        <div className="budget-preview-grid">
          {budgets.map(budget => {
            const spent = filteredTransactions
              .filter(t => {
                if (t.type !== 'expense') return false
                return t.category === budget.category || 
                  (budget.category === 'other' && (
                    !t.category || 
                    t.category === 'other' || 
                    t.category === 'Khác' || 
                    t.category === 'Khác (Chi)' || 
                    t.category === 'Chi tiêu khác' ||
                    !KNOWN_EXPENSE_CATEGORIES.includes(t.category)
                  ))
              })
              .reduce((sum, t) => sum + t.amount, 0)
            const percent = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0
            const isOver = spent > budget.limit

            return (
              <div className="budget-preview-item" key={budget.id}>
                <div className="budget-preview-top">
                  <span>{budget.icon} {budget.label}</span>
                  <span className={isOver ? 'budget-over' : ''}>
                    {formatMoney(spent)} / {formatMoney(budget.limit)}
                  </span>
                </div>
                <div className="budget-preview-bar">
                  <div 
                    className="budget-preview-fill"
                    style={{ 
                      width: `${percent}%`,
                      background: isOver 
                        ? 'linear-gradient(90deg, #ff6b6b, #ee5a24)' 
                        : `linear-gradient(90deg, ${budget.color}, ${budget.color}88)`,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

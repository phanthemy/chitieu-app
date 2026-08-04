import React, { useState } from 'react'
import { Bell, Search, Eye, EyeOff, PlusCircle, MinusCircle, ArrowUpRight, BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import TransactionCard from '../components/TransactionCard'
import { AreaChart, PieChart, ProgressBar, MiniChart } from '../components/Chart'
import './Dashboard.css'

export default function Dashboard({ transactions, budgets, navigate }) {
  const [showBalance, setShowBalance] = useState(true)

  const incomes = transactions.filter(t => t.type === 'income')
  const expenses = transactions.filter(t => t.type === 'expense')
  
  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0)
  const balance = totalIncome - totalExpense

  const formatMoney = (amount) => {
    return showBalance ? new Intl.NumberFormat('vi-VN').format(amount) + ' ₫' : '******'
  }

  return (
    <div className="dashboard fade-in">
      {/* Header */}
      <header className="dash-header">
        <div className="header-left">
          <h1 className="title-font heading">Xin chào, Người dùng</h1>
          <span className="caption">Hôm nay, 04/08/2026</span>
        </div>
        <div className="header-right">
          <button className="btn-icon"><Search size={20} /></button>
          <button className="btn-icon relative">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          <div className="dash-avatar">S</div>
        </div>
      </header>

      {/* Balance Card */}
      <section className="balance-section">
        <div className="balance-card">
          <div className="balance-label-row">
            <span className="balance-label">Tổng số dư</span>
            <button className="btn-icon" onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <h2 className="balance-amount">{formatMoney(balance)}</h2>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <button className="action-btn" onClick={() => navigate('/add')}>
          <div className="action-icon bg-success-light text-success"><PlusCircle size={24} /></div>
          <span>Thu nhập</span>
        </button>
        <button className="action-btn" onClick={() => navigate('/add')}>
          <div className="action-icon bg-danger-light text-danger"><MinusCircle size={24} /></div>
          <span>Chi tiêu</span>
        </button>
        <button className="action-btn">
          <div className="action-icon bg-primary-light text-primary"><ArrowUpRight size={24} /></div>
          <span>Chuyển khoản</span>
        </button>
        <button className="action-btn" onClick={() => navigate('/budget')}>
          <div className="action-icon bg-warning-light text-warning"><BarChart3 size={24} /></div>
          <span>Thống kê</span>
        </button>
      </section>

      {/* Stat Cards */}
      <section className="stat-cards">
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-success-light text-success"><TrendingUp size={20} /></div>
            <span className="stat-badge success">↑ 12%</span>
          </div>
          <div className="stat-body">
            <div className="stat-info">
              <span className="stat-label">Thu nhập</span>
              <span className="stat-value">{formatMoney(totalIncome)}</span>
            </div>
            <MiniChart color="#22C55E" data={[2, 4, 3, 5, 4, 6, 8, totalIncome/1000000]} />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-danger-light text-danger"><TrendingDown size={20} /></div>
            <span className="stat-badge danger">↓ 5%</span>
          </div>
          <div className="stat-body">
            <div className="stat-info">
              <span className="stat-label">Chi tiêu</span>
              <span className="stat-value">{formatMoney(totalExpense)}</span>
            </div>
            <MiniChart color="#EF4444" data={[5, 4, 6, 3, 5, 4, 2, totalExpense/1000000]} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-primary-light text-primary"><BarChart3 size={20} /></div>
          </div>
          <div className="stat-body">
            <div className="stat-info">
              <span className="stat-label">Giao dịch</span>
              <span className="stat-value">{transactions.length}</span>
            </div>
            <MiniChart color="#2563EB" data={[1, 3, 2, 4, 3, 5, 2, transactions.length]} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <div className="stat-icon bg-warning-light text-warning"><PlusCircle size={20} /></div>
          </div>
          <div className="stat-body">
            <div className="stat-info">
              <span className="stat-label">Tiết kiệm</span>
              <span className="stat-value">64%</span>
            </div>
            <MiniChart color="#F59E0B" data={[40, 50, 45, 55, 60, 58, 62, 64]} />
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="charts-section">
        <div className="chart-card">
          <h3 className="section-title mb-4">Tổng quan tháng 8</h3>
          <AreaChart />
        </div>
        <div className="chart-card">
          <h3 className="section-title mb-4">Cơ cấu chi tiêu</h3>
          <PieChart />
        </div>
      </section>

      {/* Bottom Grid */}
      <section className="bottom-grid">
        <div className="recent-transactions card">
          <div className="section-header">
            <h3 className="section-title">Giao dịch gần đây</h3>
            <button className="link-btn" onClick={() => navigate('/transactions')}>Xem tất cả →</button>
          </div>
          <div className="tx-list">
            {transactions.slice(0, 5).map(tx => (
              <TransactionCard key={tx.id} transaction={tx} />
            ))}
          </div>
        </div>

        <div className="budget-overview card">
          <div className="section-header">
            <h3 className="section-title">Ngân sách</h3>
            <button className="link-btn" onClick={() => navigate('/budget')}>Xem tất cả →</button>
          </div>
          <div className="budget-list">
            {budgets.slice(0, 3).map(budget => {
              // Mock calculation
              const spent = expenses.filter(t => t.category === budget.category).reduce((s, t) => s + t.amount, 0) || (budget.limit * 0.7)
              const percent = (spent / budget.limit) * 100
              return (
                <div key={budget.id} className="budget-item">
                  <div className="budget-item-header">
                    <span className="budget-name">{budget.label}</span>
                    <span className="budget-amounts">
                      {new Intl.NumberFormat('vi-VN').format(spent)} / {new Intl.NumberFormat('vi-VN').format(budget.limit)}
                    </span>
                  </div>
                  <ProgressBar percent={percent} color={budget.color} />
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

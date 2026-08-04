import React from 'react'
import { Pencil, Utensils, Car, ShoppingBag, Zap, Heart, Gamepad2, Lightbulb } from 'lucide-react'
import { ProgressBar } from '../components/Chart'
import './BudgetPage.css'

export default function BudgetPage({ budgets, transactions, onUpdateBudget }) {
  // Map icons
  const iconMap = {
    food: Utensils,
    transport: Car,
    shopping: ShoppingBag,
    bills: Zap,
    health: Heart,
    entertainment: Gamepad2
  }

  // Calculate totals
  const expenses = transactions.filter(t => t.type === 'expense')
  
  let totalLimit = 0
  let totalSpent = 0

  const budgetStats = budgets.map(budget => {
    const spent = expenses.filter(t => t.category === budget.category).reduce((s, t) => s + t.amount, 0) || (budget.limit * Math.random() * 0.8) // mockup for demo
    totalLimit += budget.limit
    totalSpent += spent
    
    return {
      ...budget,
      spent,
      percent: (spent / budget.limit) * 100
    }
  })

  const totalPercent = (totalSpent / totalLimit) * 100

  return (
    <div className="budget-page fade-in">
      <h1 className="title-font heading mb-6">Ngân sách tháng 8</h1>

      <div className="budget-overview-main card">
        <div className="circular-progress-container">
          <svg viewBox="0 0 100 100" className="circular-progress">
            <circle cx="50" cy="50" r="40" className="circle-bg" />
            <circle 
              cx="50" cy="50" r="40" 
              className="circle-fill" 
              style={{ 
                strokeDasharray: 251.2, 
                strokeDashoffset: 251.2 - (251.2 * Math.min(totalPercent, 100)) / 100,
                stroke: totalPercent > 100 ? 'var(--danger)' : (totalPercent > 80 ? 'var(--warning)' : 'var(--primary)')
              }} 
            />
          </svg>
          <div className="circular-content">
            <span className="circular-spent">{new Intl.NumberFormat('vi-VN').format(totalSpent)}</span>
            <span className="circular-limit">/ {new Intl.NumberFormat('vi-VN').format(totalLimit)} ₫</span>
          </div>
        </div>
        <p className="overview-text">
          Bạn đã sử dụng <strong className="amount-text">{totalPercent.toFixed(0)}%</strong> ngân sách tháng này.
        </p>
      </div>

      <div className="budget-grid">
        {budgetStats.map(budget => {
          const Icon = iconMap[budget.category] || ShoppingBag
          return (
            <div key={budget.id} className="budget-card card">
              <div className="bc-header">
                <div className="bc-title-wrap">
                  <div className="bc-icon" style={{ backgroundColor: `${budget.color}20`, color: budget.color }}>
                    <Icon size={20} />
                  </div>
                  <span className="bc-title">{budget.label}</span>
                </div>
                <button className="btn-icon bc-edit"><Pencil size={16} /></button>
              </div>

              <div className="bc-stats">
                <span className="bc-spent amount-text">{new Intl.NumberFormat('vi-VN').format(budget.spent)} ₫</span>
                <span className="bc-limit">/ {new Intl.NumberFormat('vi-VN').format(budget.limit)} ₫</span>
              </div>

              <ProgressBar percent={budget.percent} color={budget.color} label={`${budget.percent.toFixed(0)}%`} />
            </div>
          )
        })}
      </div>

      <div className="tips-card">
        <div className="tip-icon"><Lightbulb size={24} color="#F59E0B" /></div>
        <div className="tip-content">
          <h4>Quy tắc 50/30/20</h4>
          <p>Dành 50% cho nhu cầu thiết yếu, 30% cho mong muốn và 20% cho tiết kiệm. Quản lý tốt để sớm đạt tự do tài chính nhé!</p>
        </div>
      </div>
    </div>
  )
}

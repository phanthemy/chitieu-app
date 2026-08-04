import React from 'react'
import { Utensils, Car, Home, Gamepad2, Heart, ShoppingBag, Zap, Wallet, Laptop, MoreHorizontal, X } from 'lucide-react'
import './TransactionCard.css'

export default function TransactionCard({ transaction, onDelete }) {
  const isIncome = transaction.type === 'income'
  
  const categoryConfig = {
    food: { icon: Utensils, color: '#F97316', bg: 'rgba(249, 115, 22, 0.1)', label: 'Ăn uống' },
    transport: { icon: Car, color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)', label: 'Đi lại' },
    rent: { icon: Home, color: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.1)', label: 'Tiền nhà' },
    shopping: { icon: ShoppingBag, color: '#EC4899', bg: 'rgba(236, 72, 153, 0.1)', label: 'Mua sắm' },
    bills: { icon: Zap, color: '#06B6D4', bg: 'rgba(6, 182, 212, 0.1)', label: 'Hóa đơn' },
    health: { icon: Heart, color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)', label: 'Sức khỏe' },
    entertainment: { icon: Gamepad2, color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', label: 'Giải trí' },
    salary: { icon: Wallet, color: '#2563EB', bg: 'rgba(37, 99, 235, 0.1)', label: 'Lương' },
    freelance: { icon: Laptop, color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', label: 'Freelance' },
    other: { icon: MoreHorizontal, color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)', label: 'Khác' }
  }

  const config = categoryConfig[transaction.category] || categoryConfig.other
  const Icon = config.icon

  const formattedAmount = new Intl.NumberFormat('vi-VN').format(transaction.amount) + ' ₫'
  const prefix = isIncome ? '+' : '-'

  return (
    <div className="transaction-row fade-in-up">
      <div className="tx-left">
        <div className="tx-icon" style={{ backgroundColor: config.bg, color: config.color }}>
          <Icon size={20} />
        </div>
        <div className="tx-info">
          <span className="tx-note">{transaction.note || config.label}</span>
          <span className="tx-category">{config.label}</span>
        </div>
      </div>
      
      <div className="tx-right">
        <div className="tx-amounts">
          <span className={`tx-amount amount-text ${isIncome ? 'income' : 'expense'}`}>
            {prefix}{formattedAmount}
          </span>
          <span className="tx-date">{transaction.date}</span>
        </div>
        {onDelete && (
          <button className="tx-delete" onClick={() => onDelete(transaction.id)}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

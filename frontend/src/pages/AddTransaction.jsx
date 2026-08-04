import React, { useState, useEffect } from 'react'
import { Utensils, Car, Home, Gamepad2, Heart, ShoppingBag, Zap, Wallet, Laptop, MoreHorizontal, Check } from 'lucide-react'
import './AddTransaction.css'

export default function AddTransaction({ onAdd, navigate }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [showToast, setShowToast] = useState(false)

  const expenseCategories = [
    { id: 'food', icon: Utensils, color: '#F97316', label: 'Ăn uống' },
    { id: 'transport', icon: Car, color: '#3B82F6', label: 'Đi lại' },
    { id: 'rent', icon: Home, color: '#8B5CF6', label: 'Tiền nhà' },
    { id: 'shopping', icon: ShoppingBag, color: '#EC4899', label: 'Mua sắm' },
    { id: 'bills', icon: Zap, color: '#06B6D4', label: 'Hóa đơn' },
    { id: 'health', icon: Heart, color: '#22C55E', label: 'Sức khỏe' },
    { id: 'entertainment', icon: Gamepad2, color: '#F59E0B', label: 'Giải trí' },
    { id: 'other', icon: MoreHorizontal, color: '#6B7280', label: 'Khác' },
  ]

  const incomeCategories = [
    { id: 'salary', icon: Wallet, color: '#2563EB', label: 'Lương' },
    { id: 'freelance', icon: Laptop, color: '#10B981', label: 'Freelance' },
    { id: 'other', icon: MoreHorizontal, color: '#6B7280', label: 'Khác' },
  ]

  const currentCategories = type === 'expense' ? expenseCategories : incomeCategories

  useEffect(() => {
    setCategory('') // Reset on type change
  }, [type])

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/\D/g, '')
    setAmount(val)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!amount || !category) return

    onAdd({
      type,
      amount: parseInt(amount, 10),
      category,
      note,
      date
    })
  }

  const formatAmount = (val) => {
    if (!val) return '0 ₫'
    return new Intl.NumberFormat('vi-VN').format(parseInt(val, 10)) + ' ₫'
  }

  return (
    <div className="add-transaction-page fade-in">
      <div className="add-container card">
        <h1 className="title-font heading add-title">Thêm giao dịch mới</h1>

        <div className="type-toggle">
          <div className="type-toggle-bg" style={{ transform: type === 'expense' ? 'translateX(0)' : 'translateX(100%)' }}></div>
          <button 
            className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
            onClick={() => setType('expense')}
          >
            Chi tiêu
          </button>
          <button 
            className={`type-btn ${type === 'income' ? 'active income' : ''}`}
            onClick={() => setType('income')}
          >
            Thu nhập
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-form">
          <div className="amount-section">
            <input 
              type="text" 
              className="amount-input amount-text"
              placeholder="0"
              value={amount ? new Intl.NumberFormat('vi-VN').format(amount) : ''}
              onChange={handleAmountChange}
              required
            />
            <div className={`amount-preview ${type === 'income' ? 'text-success' : ''}`}>
              {type === 'income' ? '+' : '-'}{formatAmount(amount)}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <div className="category-grid">
              {currentCategories.map(cat => {
                const Icon = cat.icon
                const isActive = category === cat.id
                return (
                  <div 
                    key={cat.id}
                    className={`category-chip ${isActive ? 'active' : ''}`}
                    onClick={() => setCategory(cat.id)}
                    style={isActive ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                  >
                    <div className="chip-icon">
                      <Icon size={20} color={isActive ? 'white' : '#6B7280'} />
                    </div>
                    <span className="chip-label" style={{ color: isActive ? 'white' : 'var(--text-secondary)' }}>
                      {cat.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <input 
              type="text" 
              className="input" 
              placeholder="Nhập ghi chú (không bắt buộc)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Ngày giao dịch</label>
            <input 
              type="date" 
              className="input" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary flex-1" onClick={() => navigate('/dashboard')}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary flex-1" disabled={!amount || !category}>
              Lưu giao dịch
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

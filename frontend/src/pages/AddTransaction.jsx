import { useState } from 'react'
import './AddTransaction.css'

const CATEGORIES_EXPENSE = [
  { value: 'food', label: 'Ăn uống', icon: '🍜' },
  { value: 'transport', label: 'Đi lại', icon: '🚗' },
  { value: 'rent', label: 'Nhà ở', icon: '🏠' },
  { value: 'shopping', label: 'Mua sắm', icon: '🛍️' },
  { value: 'bills', label: 'Hóa đơn', icon: '💡' },
  { value: 'health', label: 'Sức khỏe', icon: '💊' },
  { value: 'entertainment', label: 'Giải trí', icon: '🎮' },
  { value: 'other', label: 'Khác', icon: '📦' },
]

const CATEGORIES_INCOME = [
  { value: 'salary', label: 'Lương', icon: '💰' },
  { value: 'freelance', label: 'Freelance', icon: '💻' },
  { value: 'other', label: 'Khác', icon: '🤝' },
]

export default function AddTransaction({ onAdd, navigate }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [note, setNote] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [showSuccess, setShowSuccess] = useState(false)

  const categories = type === 'income' ? CATEGORIES_INCOME : CATEGORIES_EXPENSE

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!amount || !category) return

    const selectedCat = categories.find(c => c.value === category)
    
    onAdd({
      type,
      amount: parseFloat(amount),
      category,
      note: note || selectedCat?.label || category,
      date,
      icon: selectedCat?.icon || '💸',
    })

    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 2000)

    // Reset
    setAmount('')
    setCategory('')
    setNote('')
  }

  const formatPreview = (val) => {
    if (!val) return '0'
    return new Intl.NumberFormat('vi-VN').format(parseFloat(val))
  }

  return (
    <div className="add-tx-page">
      <div className="page-header animate-fade-in-up">
        <h1>Thêm giao dịch mới</h1>
        <p>Ghi lại thu chi hàng ngày</p>
      </div>

      {/* Success toast */}
      {showSuccess && (
        <div className="toast-container">
          <div className="toast toast-success animate-slide-in-left">
            ✅ Đã thêm giao dịch thành công!
          </div>
        </div>
      )}

      <div className="add-tx-container animate-fade-in-up">
        {/* Type selector */}
        <div className="add-tx-type-toggle">
          <button 
            className={`type-toggle-btn ${type === 'expense' ? 'active type-expense' : ''}`}
            onClick={() => { setType('expense'); setCategory('') }}
          >
            <span className="type-toggle-icon">📉</span>
            <span>Chi tiêu</span>
          </button>
          <button 
            className={`type-toggle-btn ${type === 'income' ? 'active type-income' : ''}`}
            onClick={() => { setType('income'); setCategory('') }}
          >
            <span className="type-toggle-icon">📈</span>
            <span>Thu nhập</span>
          </button>
          <div className={`type-toggle-slider ${type === 'income' ? 'slider-right' : ''}`} />
        </div>

        {/* Amount input - Hero style */}
        <div className="add-tx-amount-section glass-card">
          <label className="amount-label">Số tiền</label>
          <div className="amount-input-wrapper">
            <span className={`amount-sign ${type === 'income' ? 'sign-income' : 'sign-expense'}`}>
              {type === 'income' ? '+' : '-'}
            </span>
            <input
              type="number"
              className="amount-input"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
            <span className="amount-currency">₫</span>
          </div>
          <div className="amount-preview">
            {formatPreview(amount)} VND
          </div>
        </div>

        <form onSubmit={handleSubmit} className="add-tx-form">
          {/* Category Grid */}
          <div className="form-group">
            <label className="form-label">Danh mục</label>
            <div className="category-grid">
              {categories.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  className={`category-chip ${category === cat.value ? 'category-selected' : ''}`}
                  onClick={() => setCategory(cat.value)}
                >
                  <span className="category-chip-icon">{cat.icon}</span>
                  <span className="category-chip-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <div className="input-wrapper">
              <span className="input-icon">📝</span>
              <input
                type="text"
                className="form-input input-with-icon"
                placeholder="Mô tả giao dịch..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label">Ngày</label>
            <div className="input-wrapper">
              <span className="input-icon">📅</span>
              <input
                type="date"
                className="form-input input-with-icon"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* Preview Card */}
          {amount && category && (
            <div className="tx-preview glass-card animate-scale-in">
              <div className="tx-preview-label">Xem trước</div>
              <div className="tx-preview-content">
                <div className="tx-preview-left">
                  <span className="tx-preview-icon">
                    {categories.find(c => c.value === category)?.icon}
                  </span>
                  <div>
                    <div className="tx-preview-note">
                      {note || categories.find(c => c.value === category)?.label}
                    </div>
                    <div className="tx-preview-cat">
                      {categories.find(c => c.value === category)?.label} • {date}
                    </div>
                  </div>
                </div>
                <span className={`tx-preview-amount ${type === 'income' ? 'tx-amount-income' : 'tx-amount-expense'}`}>
                  {type === 'income' ? '+' : '-'}{formatPreview(amount)} ₫
                </span>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="add-tx-actions">
            <button 
              type="button" 
              className="btn btn-secondary btn-lg"
              onClick={() => navigate('/transactions')}
            >
              ← Hủy
            </button>
            <button 
              type="submit" 
              className={`btn btn-lg btn-full ${type === 'income' ? 'btn-success' : 'btn-primary'}`}
              disabled={!amount || !category}
            >
              {type === 'income' ? '📈 Thêm thu nhập' : '📉 Thêm chi tiêu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

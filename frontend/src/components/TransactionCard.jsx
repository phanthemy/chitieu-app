import './TransactionCard.css'

const formatMoney = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) return 'Hôm nay'
  if (date.toDateString() === yesterday.toDateString()) return 'Hôm qua'
  
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

export default function TransactionCard({ transaction, onDelete, style }) {
  const { type, amount, category, note, date, icon } = transaction
  const isIncome = type === 'income'

  return (
    <div className="tx-card glass-card" style={style}>
      <div className="tx-card-left">
        <div className={`tx-icon ${isIncome ? 'tx-icon-income' : 'tx-icon-expense'}`}>
          {icon || (isIncome ? '💰' : '💸')}
        </div>
        <div className="tx-info">
          <span className="tx-note">{note}</span>
          <div className="tx-meta">
            <CategoryBadge category={category} type={type} />
            <span className="tx-date">{formatDate(date)}</span>
          </div>
        </div>
      </div>
      <div className="tx-card-right">
        <span className={`tx-amount ${isIncome ? 'tx-amount-income' : 'tx-amount-expense'}`}>
          {isIncome ? '+' : '-'}{formatMoney(amount)}
        </span>
        {onDelete && (
          <button className="tx-delete" onClick={() => onDelete(transaction.id)} title="Xóa">
            ✕
          </button>
        )}
      </div>
    </div>
  )
}

export function CategoryBadge({ category, type }) {
  const categoryLabels = {
    salary: 'Lương',
    freelance: 'Freelance',
    food: 'Ăn uống',
    transport: 'Đi lại',
    rent: 'Nhà ở',
    shopping: 'Mua sắm',
    bills: 'Hóa đơn',
    health: 'Sức khỏe',
    entertainment: 'Giải trí',
    other: 'Khác',
  }

  return (
    <span className={`badge ${type === 'income' ? 'badge-income' : 'badge-expense'}`}>
      {categoryLabels[category] || category}
    </span>
  )
}

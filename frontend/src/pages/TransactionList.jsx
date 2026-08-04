import React, { useState } from 'react'
import { Search, Filter, ArrowUpDown } from 'lucide-react'
import TransactionCard from '../components/TransactionCard'
import './TransactionList.css'

export default function TransactionList({ transactions, onDelete }) {
  const [filter, setFilter] = useState('all') // all, income, expense
  const [searchTerm, setSearchTerm] = useState('')

  const filteredTx = transactions
    .filter(t => filter === 'all' ? true : t.type === filter)
    .filter(t => 
      t.note?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

  // Group by date
  const groupedTx = filteredTx.reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = []
    acc[tx.date].push(tx)
    return acc
  }, {})

  // Sort dates descending
  const sortedDates = Object.keys(groupedTx).sort((a, b) => new Date(b) - new Date(a))

  const totalFiltered = filteredTx.length
  const sumFiltered = filteredTx.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0)

  return (
    <div className="transaction-list-page fade-in">
      <div className="tx-page-header">
        <h1 className="title-font heading">Giao dịch <span className="count-badge">{totalFiltered}</span></h1>
      </div>

      <div className="tx-controls">
        <div className="search-bar">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Tìm kiếm giao dịch..." 
            className="input search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button 
            className={`filter-pill ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Tất cả
          </button>
          <button 
            className={`filter-pill ${filter === 'income' ? 'active' : ''}`}
            onClick={() => setFilter('income')}
          >
            Thu nhập
          </button>
          <button 
            className={`filter-pill ${filter === 'expense' ? 'active' : ''}`}
            onClick={() => setFilter('expense')}
          >
            Chi tiêu
          </button>
        </div>
      </div>

      <div className="tx-summary-bar">
        <span>Tổng cộng:</span>
        <span className={`amount-text ${sumFiltered >= 0 ? 'text-success' : 'text-danger'}`}>
          {sumFiltered >= 0 ? '+' : ''}{new Intl.NumberFormat('vi-VN').format(sumFiltered)} ₫
        </span>
      </div>

      <div className="tx-grouped-list">
        {sortedDates.length === 0 ? (
          <div className="empty-state">
            <p>Không tìm thấy giao dịch nào</p>
          </div>
        ) : (
          sortedDates.map(date => {
            const dayTxs = groupedTx[date]
            const dayTotal = dayTxs.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum - t.amount, 0)
            
            return (
              <div key={date} className="tx-date-group">
                <div className="date-divider">
                  <span className="date-label">{date}</span>
                  <span className="date-total amount-text">
                    {dayTotal >= 0 ? '+' : ''}{new Intl.NumberFormat('vi-VN').format(dayTotal)} ₫
                  </span>
                </div>
                <div className="card tx-card-container">
                  {dayTxs.map(tx => (
                    <TransactionCard key={tx.id} transaction={tx} onDelete={onDelete} />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

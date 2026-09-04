import { useState, useRef, useEffect } from 'react'
import './MonthPicker.css'

export default function MonthPicker({ period, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef(null)

  const currentRealDate = new Date()
  const currentRealMonth = currentRealDate.getMonth() + 1
  const currentRealYear = currentRealDate.getFullYear()

  const { month, year, allTime } = period

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handlePrevMonth = (e) => {
    e.stopPropagation()
    if (allTime) {
      onChange({ month: currentRealMonth, year: currentRealYear, allTime: false })
      return
    }
    if (month === 1) {
      onChange({ month: 12, year: year - 1, allTime: false })
    } else {
      onChange({ month: month - 1, year, allTime: false })
    }
  }

  const handleNextMonth = (e) => {
    e.stopPropagation()
    if (allTime) {
      onChange({ month: currentRealMonth, year: currentRealYear, allTime: false })
      return
    }
    if (month === 12) {
      onChange({ month: 1, year: year + 1, allTime: false })
    } else {
      onChange({ month: month + 1, year, allTime: false })
    }
  }

  const handleSelectMonth = (m) => {
    onChange({ month: m, year, allTime: false })
    setIsOpen(false)
  }

  const handleSelectYear = (y) => {
    onChange({ month, year: y, allTime: false })
  }

  const handleSetThisMonth = () => {
    onChange({ month: currentRealMonth, year: currentRealYear, allTime: false })
    setIsOpen(false)
  }

  const handleSetPrevMonth = () => {
    const prevM = currentRealMonth === 1 ? 12 : currentRealMonth - 1
    const prevY = currentRealMonth === 1 ? currentRealYear - 1 : currentRealYear
    onChange({ month: prevM, year: prevY, allTime: false })
    setIsOpen(false)
  }

  const handleSetAllTime = () => {
    onChange({ ...period, allTime: true })
    setIsOpen(false)
  }

  const years = [currentRealYear - 2, currentRealYear - 1, currentRealYear, currentRealYear + 1]

  const displayText = allTime
    ? 'Tất cả thời gian'
    : `Tháng ${String(month).padStart(2, '0')}/${year}`

  const isCurrentMonthActive = !allTime && month === currentRealMonth && year === currentRealYear

  return (
    <div className={`month-picker-container ${className}`} ref={popoverRef}>
      <div className="month-picker-bar glass-card">
        <button
          type="button"
          className="month-nav-btn"
          onClick={handlePrevMonth}
          title="Tháng trước"
          aria-label="Tháng trước"
        >
          ‹
        </button>

        <button
          type="button"
          className={`month-display-btn ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="month-icon">📅</span>
          <span className="month-text">{displayText}</span>
          <span className="month-chevron">{isOpen ? '▲' : '▼'}</span>
        </button>

        <button
          type="button"
          className="month-nav-btn"
          onClick={handleNextMonth}
          title="Tháng sau"
          aria-label="Tháng sau"
        >
          ›
        </button>

        {!isCurrentMonthActive && (
          <button
            type="button"
            className="month-quick-pill"
            onClick={handleSetThisMonth}
            title="Quay lại tháng này"
          >
            Tháng này
          </button>
        )}
      </div>

      {isOpen && (
        <div className="month-picker-dropdown glass-card animate-scale-in">
          <div className="dropdown-quick-filters">
            <button
              type="button"
              className={`pill-btn ${isCurrentMonthActive ? 'active' : ''}`}
              onClick={handleSetThisMonth}
            >
              Tháng này
            </button>
            <button
              type="button"
              className="pill-btn"
              onClick={handleSetPrevMonth}
            >
              Tháng trước
            </button>
            <button
              type="button"
              className={`pill-btn ${allTime ? 'active' : ''}`}
              onClick={handleSetAllTime}
            >
              Tất cả thời gian
            </button>
          </div>

          <div className="dropdown-year-select">
            <span className="year-label">Năm:</span>
            <div className="year-pills">
              {years.map((y) => (
                <button
                  key={y}
                  type="button"
                  className={`year-btn ${year === y && !allTime ? 'active' : ''}`}
                  onClick={() => handleSelectYear(y)}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div className="dropdown-months-grid">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
              const isSelected = !allTime && month === m
              const isCurrent = m === currentRealMonth && year === currentRealYear
              return (
                <button
                  key={m}
                  type="button"
                  className={`month-cell ${isSelected ? 'selected' : ''} ${isCurrent ? 'current' : ''}`}
                  onClick={() => handleSelectMonth(m)}
                >
                  <span className="m-num">Tháng {m}</span>
                  {isCurrent && <span className="current-dot" title="Hiện tại" />}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

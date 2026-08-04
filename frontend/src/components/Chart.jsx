import React, { useEffect, useState } from 'react'
import './Chart.css'

export function AreaChart() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

  // Dummy data
  const points = [
    { x: 0, income: 40, expense: 30 },
    { x: 25, income: 60, expense: 45 },
    { x: 50, income: 45, expense: 70 },
    { x: 75, income: 80, expense: 50 },
    { x: 100, income: 100, expense: 65 },
  ]

  const createPath = (key) => {
    return points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${100 - point[key]}`
      const prev = points[i - 1]
      const cp1x = prev.x + (point.x - prev.x) / 2
      const cp1y = 100 - prev[key]
      const cp2x = cp1x
      const cp2y = 100 - point[key]
      return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${100 - point[key]}`
    }, "")
  }

  const incomePath = createPath('income')
  const expensePath = createPath('expense')

  const incomeFill = `${incomePath} L 100 100 L 0 100 Z`
  const expenseFill = `${expensePath} L 100 100 L 0 100 Z`

  return (
    <div className="chart-container">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="area-chart-svg">
        <defs>
          <linearGradient id="income-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="expense-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F43F5E" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="#F1F5F9" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#F1F5F9" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="#F1F5F9" strokeWidth="0.5" />

        <g className={`chart-lines ${mounted ? 'draw' : ''}`}>
          {/* Fills */}
          <path d={incomeFill} fill="url(#income-grad)" className="chart-fill" />
          <path d={expenseFill} fill="url(#expense-grad)" className="chart-fill" />
          
          {/* Lines */}
          <path d={incomePath} fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" className="chart-line" />
          <path d={expensePath} fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" className="chart-line" />
        </g>
      </svg>
      <div className="x-axis">
        <span>Tuần 1</span>
        <span>Tuần 2</span>
        <span>Tuần 3</span>
        <span>Tuần 4</span>
      </div>
    </div>
  )
}

export function PieChart() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

  const data = [
    { color: '#F97316', percent: 40, label: 'Ăn uống', amount: '2.560.000' },
    { color: '#3B82F6', percent: 25, label: 'Đi lại', amount: '1.600.000' },
    { color: '#8B5CF6', percent: 20, label: 'Tiền nhà', amount: '1.280.000' },
    { color: '#EC4899', percent: 15, label: 'Mua sắm', amount: '960.000' },
  ]

  let cumulativePercent = 0

  const getCoordinatesForPercent = (percent) => {
    const x = Math.cos(2 * Math.PI * percent)
    const y = Math.sin(2 * Math.PI * percent)
    return [x, y]
  }

  return (
    <div className="pie-container">
      <div className="pie-svg-wrapper">
        <svg viewBox="-1 -1 2 2" className="pie-svg" style={{ transform: 'rotate(-90deg)' }}>
          {data.map((slice, i) => {
            const startX = getCoordinatesForPercent(cumulativePercent)[0]
            const startY = getCoordinatesForPercent(cumulativePercent)[1]
            cumulativePercent += slice.percent / 100
            const endX = getCoordinatesForPercent(cumulativePercent)[0]
            const endY = getCoordinatesForPercent(cumulativePercent)[1]
            const largeArcFlag = slice.percent > 50 ? 1 : 0
            const pathData = [
              `M ${startX} ${startY}`,
              `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
              `L 0 0`,
            ].join(' ')

            return (
              <path
                key={i}
                d={pathData}
                fill={slice.color}
                className={`pie-slice ${mounted ? 'draw' : ''}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              />
            )
          })}
          <circle cx="0" cy="0" r="0.75" fill="#FFFFFF" />
        </svg>
        <div className="pie-center">
          <span className="pie-center-amount">6.4M</span>
          <span className="pie-center-label">Tổng chi</span>
        </div>
      </div>
      <div className="pie-legend">
        {data.map((item, i) => (
          <div key={i} className="legend-item">
            <div className="legend-left">
              <div className="legend-dot" style={{ backgroundColor: item.color }}></div>
              <span className="legend-label">{item.label}</span>
            </div>
            <div className="legend-right">
              <span className="legend-amount">{item.amount}</span>
              <span className="legend-percent">{item.percent}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProgressBar({ percent, color, label }) {
  const isWarning = percent > 80
  const isDanger = percent > 100
  const barColor = isDanger ? '#EF4444' : (isWarning ? '#F59E0B' : (color || '#2563EB'))
  const width = Math.min(percent, 100)

  return (
    <div className="progress-container">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-track">
        <div 
          className="progress-fill"
          style={{ width: `${width}%`, backgroundColor: barColor }}
        ></div>
      </div>
    </div>
  )
}

export function MiniChart({ color, data }) {
  const defaultData = [10, 25, 15, 40, 30, 50, 45, 60]
  const pts = data || defaultData
  const max = Math.max(...pts)
  
  const path = pts.reduce((acc, val, i) => {
    const x = (i / (pts.length - 1)) * 60
    const y = 24 - (val / max) * 24
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`
  }, "")

  return (
    <svg width="60" height="24" className="mini-chart">
      <path d={path} fill="none" stroke={color || "#2563EB"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

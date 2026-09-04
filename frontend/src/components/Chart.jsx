import { useRef, useEffect } from 'react'
import './Chart.css'

const formatMoney = (amount) => {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`
  return amount.toString()
}

/* ============================================
   Donut Chart (CSS-based)
   ============================================ */
export function DonutChart({ data, size = 200, centerLabel, centerValue }) {
  // data: [{ label, value, color }]
  const total = data.reduce((sum, d) => sum + d.value, 0)
  let cumulativePercent = 0

  const segments = data.map((d) => {
    const percent = total > 0 ? (d.value / total) * 100 : 0
    const segment = {
      ...d,
      percent,
      offset: cumulativePercent,
    }
    cumulativePercent += percent
    return segment
  })

  // Build conic-gradient
  const gradientParts = segments.map(s => {
    return `${s.color} ${s.offset}% ${s.offset + s.percent}%`
  }).join(', ')

  const gradientStyle = total > 0 
    ? `conic-gradient(${gradientParts})`
    : 'conic-gradient(rgba(255,255,255,0.05) 0% 100%)'

  return (
    <div className="donut-wrapper">
      <div 
        className="donut-chart" 
        style={{ 
          width: size, 
          height: size,
          background: gradientStyle,
        }}
      >
        <div className="donut-hole">
          <span className="donut-value">{centerValue}</span>
          <span className="donut-label">{centerLabel}</span>
        </div>
      </div>
      <div className="donut-legend">
        {segments.filter(s => s.percent > 0).map((s, i) => (
          <div className="legend-item" key={i}>
            <span className="legend-dot" style={{ background: s.color }} />
            <span className="legend-label">{s.label}</span>
            <span className="legend-percent">{s.percent.toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ============================================
   Bar Chart (Canvas-based)
   ============================================ */
export function BarChart({ data, height = 200 }) {
  // data: [{ label, income, expense }]
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data?.length) return
    
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const w = rect.width
    const h = rect.height
    const padding = { top: 20, right: 20, bottom: 40, left: 10 }
    const chartW = w - padding.left - padding.right
    const chartH = h - padding.top - padding.bottom

    // Clear
    ctx.clearRect(0, 0, w, h)

    const maxVal = Math.max(...data.flatMap(d => [d.income || 0, d.expense || 0]), 1)
    const barGroupWidth = chartW / data.length
    const barWidth = Math.min(barGroupWidth * 0.3, 24)
    const gap = 4

    // Draw bars
    data.forEach((d, i) => {
      const groupX = padding.left + i * barGroupWidth + barGroupWidth / 2

      // Income bar
      const incomeH = (d.income / maxVal) * chartH
      const incomeGrad = ctx.createLinearGradient(0, h - padding.bottom - incomeH, 0, h - padding.bottom)
      incomeGrad.addColorStop(0, '#26de81')
      incomeGrad.addColorStop(1, '#0984e3')
      
      drawRoundedBar(ctx, groupX - barWidth - gap/2, h - padding.bottom - incomeH, barWidth, incomeH, 4)
      ctx.fillStyle = incomeGrad
      ctx.fill()

      // Expense bar
      const expenseH = (d.expense / maxVal) * chartH
      const expenseGrad = ctx.createLinearGradient(0, h - padding.bottom - expenseH, 0, h - padding.bottom)
      expenseGrad.addColorStop(0, '#ff6b6b')
      expenseGrad.addColorStop(1, '#ee5a24')
      
      drawRoundedBar(ctx, groupX + gap/2, h - padding.bottom - expenseH, barWidth, expenseH, 4)
      ctx.fillStyle = expenseGrad
      ctx.fill()

      // Label
      ctx.fillStyle = 'rgba(240, 240, 255, 0.4)'
      ctx.font = '11px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(d.label, groupX, h - padding.bottom + 20)
    })

  }, [data, height])

  function drawRoundedBar(ctx, x, y, w, h, r) {
    if (h < 1) return
    r = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.arcTo(x + w, y, x + w, y + r, r)
    ctx.lineTo(x + w, y + h)
    ctx.lineTo(x, y + h)
    ctx.lineTo(x, y + r)
    ctx.arcTo(x, y, x + r, y, r)
    ctx.closePath()
  }

  return (
    <div className="bar-chart-wrapper">
      <canvas 
        ref={canvasRef} 
        style={{ width: '100%', height: `${height}px` }}
        className="bar-chart-canvas"
      />
      <div className="bar-chart-legend">
        <span className="bar-legend-item">
          <span className="bar-legend-dot" style={{ background: 'linear-gradient(135deg, #26de81, #0984e3)' }} />
          Thu nhập
        </span>
        <span className="bar-legend-item">
          <span className="bar-legend-dot" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' }} />
          Chi tiêu
        </span>
      </div>
    </div>
  )
}

/* ============================================
   Progress Bar
   ============================================ */
export function ProgressBar({ value, max, color, showLabel = true, height = 8 }) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0
  const isOver = value > max

  return (
    <div className="progress-wrapper">
      {showLabel && (
        <div className="progress-labels">
          <span>{formatMoney(value)}</span>
          <span className="progress-max">{formatMoney(max)}</span>
        </div>
      )}
      <div className="progress-track" style={{ height }}>
        <div 
          className={`progress-fill ${isOver ? 'progress-over' : ''}`}
          style={{ 
            width: `${percent}%`,
            background: isOver 
              ? 'linear-gradient(90deg, #ff6b6b, #ee5a24)' 
              : `linear-gradient(90deg, ${color}, ${color}88)`,
            boxShadow: `0 0 10px ${color}44`,
          }}
        />
      </div>
    </div>
  )
}

/* ============================================
   Sparkline (mini line chart)
   ============================================ */
export function Sparkline({ data, color = '#6c5ce7', width = 120, height = 40 }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !data?.length) return

    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    ctx.clearRect(0, 0, width, height)

    const padding = 4
    const chartW = width - padding * 2
    const chartH = height - padding * 2
    const max = Math.max(...data, 1)
    const min = Math.min(...data, 0)
    const range = max - min || 1

    // Draw gradient area
    ctx.beginPath()
    data.forEach((val, i) => {
      const x = padding + (i / (data.length - 1)) * chartW
      const y = padding + chartH - ((val - min) / range) * chartH
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })

    // Close area
    ctx.lineTo(padding + chartW, padding + chartH)
    ctx.lineTo(padding, padding + chartH)
    ctx.closePath()

    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, color + '40')
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.beginPath()
    data.forEach((val, i) => {
      const x = padding + (i / (data.length - 1)) * chartW
      const y = padding + chartH - ((val - min) / range) * chartH
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    })
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.stroke()

    // Draw end dot
    const lastX = padding + chartW
    const lastY = padding + chartH - ((data[data.length - 1] - min) / range) * chartH
    ctx.beginPath()
    ctx.arc(lastX, lastY, 3, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()

  }, [data, color, width, height])

  return (
    <canvas 
      ref={canvasRef}
      style={{ width, height }}
      className="sparkline-canvas"
    />
  )
}

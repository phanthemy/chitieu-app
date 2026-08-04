import { useEffect, useState } from "react";
import "./Chart.css";

const formatMoney = (amount) => {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
  return amount.toString();
};

export function DonutChart({ data, size = 200, centerLabel, centerValue }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  const center = size / 2;

  return (
    <div className="donut-wrapper" style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.map((d, i) => {
          const percent = (d.value / total);
          const strokeDasharray = `${circumference * percent} ${circumference}`;
          const strokeDashoffset = -circumference * cumulativePercent;
          cumulativePercent += percent;
          
          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke={d.color}
              strokeWidth={radius * 0.3}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              transform={`rotate(-90 ${center} ${center})`}
              className={`donut-segment ${mounted ? "animated" : ""}`}
            />
          );
        })}
        <text x="50%" y="45%" textAnchor="middle" className="donut-value" fill="var(--text-primary)" fontSize="20" fontWeight="bold">
          {centerValue}
        </text>
        <text x="50%" y="60%" textAnchor="middle" className="donut-label" fill="var(--text-secondary)" fontSize="12">
          {centerLabel}
        </text>
      </svg>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div className="legend-item" key={i}>
            <span className="legend-dot" style={{ backgroundColor: d.color }}></span>
            <span className="legend-label">{d.label}</span>
            <span className="legend-percent">{((d.value / total) * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarChart({ data, height = 200 }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!data || data.length === 0) return null;
  const maxVal = Math.max(...data.flatMap(d => [d.income || 0, d.expense || 0]), 1);
  const width = 400;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const barGroupWidth = chartW / data.length;
  const barWidth = Math.min(barGroupWidth * 0.3, 20);
  const gap = 4;

  return (
    <div className="bar-chart-wrapper" style={{ height }}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="none">
        <defs>
          <linearGradient id="income-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-income)" />
            <stop offset="100%" stopColor="var(--color-income)" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="expense-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-expense)" />
            <stop offset="100%" stopColor="var(--color-expense)" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        {data.map((d, i) => {
          const groupX = padding.left + i * barGroupWidth + barGroupWidth / 2;
          const incomeH = ((d.income || 0) / maxVal) * chartH;
          const expenseH = ((d.expense || 0) / maxVal) * chartH;
          return (
            <g key={i}>
              <rect
                x={groupX - barWidth - gap / 2}
                y={mounted ? height - padding.bottom - incomeH : height - padding.bottom}
                width={barWidth}
                height={mounted ? incomeH : 0}
                fill="url(#income-grad)"
                rx="4"
                className="bar-rect"
              />
              <rect
                x={groupX + gap / 2}
                y={mounted ? height - padding.bottom - expenseH : height - padding.bottom}
                width={barWidth}
                height={mounted ? expenseH : 0}
                fill="url(#expense-grad)"
                rx="4"
                className="bar-rect"
              />
              <text
                x={groupX}
                y={height - padding.bottom + 20}
                fill="var(--text-secondary)"
                fontSize="12"
                textAnchor="middle"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export function ProgressBar({ value, max, color, showLabel = true, height = 8 }) {
  const percent = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const isWarning = percent > 80;
  const isDanger = percent > 100;
  
  let finalColor = color;
  if (isDanger) finalColor = "var(--color-expense)";
  else if (isWarning) finalColor = "var(--color-warning)";

  return (
    <div className="progress-wrapper">
      {showLabel && (
        <div className="progress-labels">
          <span>{formatMoney(value)}</span>
          <span className="progress-max">{percent.toFixed(0)}% / {formatMoney(max)}</span>
        </div>
      )}
      <div className="progress-track" style={{ height, background: "rgba(255,255,255,0.05)", borderRadius: height/2 }}>
        <div
          className="progress-fill"
          style={{
            width: `${percent}%`,
            height: "100%",
            background: finalColor,
            borderRadius: height/2,
            transition: "width 0.5s ease-out, background 0.3s",
            boxShadow: `0 0 8px ${finalColor}80`
          }}
        />
      </div>
    </div>
  );
}

export function Sparkline({ data, color = "#667EEA", width = 120, height = 40 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const padding = 4;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * chartW;
    const y = padding + chartH - ((val - min) / range) * chartH;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `${padding},${height} ${points} ${width - padding},${height}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`spark-grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#spark-grad-${color})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <circle cx={padding + chartW} cy={padding + chartH - ((data[data.length - 1] - min) / range) * chartH} r="3" fill={color} />
    </svg>
  );
}


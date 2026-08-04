import { useState, useMemo } from "react";
import "./BudgetPage.css";
import { Edit3, Check, Utensils, Car, ShoppingBag, Zap, Heart, Gamepad2, Lightbulb } from "lucide-react";
import { ProgressBar } from "../components/Chart";

const iconMap = {
  food: Utensils,
  transport: Car,
  shopping: ShoppingBag,
  bills: Zap,
  health: Heart,
  entertainment: Gamepad2,
};

export default function BudgetPage({ budgets, transactions, onUpdateBudget }) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const formatMoney = (val) => new Intl.NumberFormat("vi-VN").format(val);

  const budgetData = useMemo(() => {
    return budgets.map((b) => {
      const spent = transactions
        .filter((t) => t.type === "expense" && t.category === b.category)
        .reduce((sum, t) => sum + t.amount, 0);
      return { ...b, spent };
    });
  }, [budgets, transactions]);

  const totalBudget = budgetData.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgetData.reduce((s, b) => s + b.spent, 0);
  const overallPercent = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  const handleEdit = (b) => {
    setEditingId(b.id);
    setEditValue(b.limit.toString());
  };

  const handleSave = (id) => {
    const num = Number(editValue.replace(/\D/g, ""));
    if (num > 0) onUpdateBudget(id, num);
    setEditingId(null);
  };

  return (
    <div className="budget-page animate-in">
      <h1 className="page-title mb-6">Ngân sách</h1>

      <section className="gauge-section glass-card">
        <h2 className="section-title text-center">Tổng quan ngân sách</h2>
        <div className="gauge-container">
          <svg viewBox="0 0 200 100" className="gauge-svg">
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="16" strokeLinecap="round" />
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="url(#gauge-grad)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray="251.2"
              strokeDashoffset={251.2 - (251.2 * overallPercent) / 100}
              className="gauge-path"
            />
            <defs>
              <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="50%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#F87171" />
              </linearGradient>
            </defs>
          </svg>
          <div className="gauge-text">
            <div className="gauge-spent mono">{formatMoney(totalSpent)}</div>
            <div className="gauge-total">/ {formatMoney(totalBudget)} ₫</div>
          </div>
        </div>
      </section>

      <div className="budget-grid">
        {budgetData.map((b) => {
          const Icon = iconMap[b.category] || Zap;
          const isEditing = editingId === b.id;
          
          return (
            <div key={b.id} className="budget-card glass-card">
              <div className="budget-header">
                <div className="budget-title">
                  <div className="budget-icon" style={{ backgroundColor: `${b.color}20`, color: b.color }}>
                    <Icon size={20} />
                  </div>
                  <h3>{b.label}</h3>
                </div>
                {isEditing ? (
                  <div className="budget-edit-group">
                    <input
                      type="text"
                      className="budget-input mono"
                      value={new Intl.NumberFormat("vi-VN").format(Number(editValue.replace(/\D/g, "") || 0))}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <button className="icon-btn save-btn" onClick={() => handleSave(b.id)}>
                      <Check size={16} />
                    </button>
                  </div>
                ) : (
                  <button className="icon-btn" onClick={() => handleEdit(b)}>
                    <Edit3 size={16} />
                  </button>
                )}
              </div>
              <ProgressBar value={b.spent} max={b.limit} color={b.color} height={12} />
            </div>
          );
        })}
      </div>

      <div className="tips-section glass-card">
        <div className="tips-icon"><Lightbulb size={24} /></div>
        <div className="tips-content">
          <h3>Mẹo quản lý tài chính</h3>
          <p>Áp dụng quy tắc 50/30/20: 50% cho nhu cầu thiết yếu, 30% cho mong muốn cá nhân, và 20% cho tiết kiệm hoặc trả nợ.</p>
        </div>
      </div>
    </div>
  );
}


import { TrendingUp, TrendingDown, ArrowLeftRight, ChevronRight } from "lucide-react";
import "./Dashboard.css";
import { BarChart, DonutChart, ProgressBar } from "../components/Chart";
import TransactionCard from "../components/TransactionCard";

const categoryColors = {
  salary: "#34D399",
  food: "#F87171",
  transport: "#FBBF24",
  rent: "#60A5FA",
  shopping: "#A78BFA",
  bills: "#38BDF8",
  health: "#34D399",
  entertainment: "#F472B6",
  freelance: "#34D399",
  other: "#94A3B8",
};

const categoryNames = {
  salary: "Lương",
  food: "Ăn uống",
  transport: "Đi lại",
  rent: "Thuê nhà",
  shopping: "Mua sắm",
  bills: "Hóa đơn",
  health: "Sức khỏe",
  entertainment: "Giải trí",
  freelance: "Freelance",
  other: "Khác",
};

export default function Dashboard({ transactions, budgets, navigate }) {
  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  const currentMonth = "08/2026";

  const chartData = [
    { label: "Tuần 1", income: 15000000, expense: 3500000 },
    { label: "Tuần 2", income: 2000000, expense: 2000000 },
    { label: "Tuần 3", income: 0, expense: 1500000 },
    { label: "Tuần 4", income: 500000, expense: 800000 },
  ];

  const expenseByCategory = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const donutData = Object.entries(expenseByCategory).map(([key, val]) => ({
    label: categoryNames[key] || "Khác",
    value: val,
    color: categoryColors[key] || "#94A3B8",
  }));

  const formatMoney = (val) => new Intl.NumberFormat("vi-VN").format(val);

  return (
    <div className="dashboard-page animate-in">
      <header className="dashboard-header">
        <div>
          <h1 className="greeting">Xin chào, Người dùng</h1>
          <p className="date-text">Hôm nay, {new Date().toLocaleDateString("vi-VN")}</p>
        </div>
      </header>

      <section className="hero-balance">
        <p className="hero-label">Tổng số dư</p>
        <h2 className="hero-amount mono">{formatMoney(balance)} ₫</h2>
      </section>

      <section className="stat-cards grid-3">
        <div className="stat-card glass-card">
          <div className="stat-icon income-icon"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Thu nhập</p>
            <p className="stat-value mono text-income">+{formatMoney(income)}</p>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon expense-icon"><TrendingDown size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Chi tiêu</p>
            <p className="stat-value mono text-expense">-{formatMoney(expense)}</p>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon tx-icon-stat"><ArrowLeftRight size={24} /></div>
          <div className="stat-info">
            <p className="stat-label">Giao dịch</p>
            <p className="stat-value mono">{transactions.length}</p>
          </div>
        </div>
      </section>

      <section className="charts-section grid-2">
        <div className="chart-card glass-card">
          <h3 className="section-title">Tổng quan {currentMonth}</h3>
          <BarChart data={chartData} height={220} />
        </div>
        <div className="chart-card glass-card">
          <h3 className="section-title">Cơ cấu chi tiêu</h3>
          <DonutChart data={donutData} size={220} centerLabel="Tổng chi" centerValue={`${(expense/1000000).toFixed(1)}M`} />
        </div>
      </section>

      <div className="grid-2 bottom-sections">
        <section className="recent-tx">
          <div className="section-header">
            <h3 className="section-title">Giao dịch gần đây</h3>
            <button className="link-btn" onClick={() => navigate("/transactions")}>
              Xem tất cả <ChevronRight size={16} />
            </button>
          </div>
          <div className="tx-list">
            {transactions.slice(0, 5).map((t) => (
              <TransactionCard key={t.id} transaction={t} />
            ))}
          </div>
        </section>

        <section className="mini-budgets">
          <div className="section-header">
            <h3 className="section-title">Ngân sách (Top 3)</h3>
            <button className="link-btn" onClick={() => navigate("/budget")}>
              Xem tất cả <ChevronRight size={16} />
            </button>
          </div>
          <div className="mini-budgets-list glass-card">
            {budgets.slice(0, 3).map((b) => {
              const spent = transactions
                .filter((t) => t.type === "expense" && t.category === b.category)
                .reduce((s, t) => s + t.amount, 0);
              return (
                <div key={b.id} className="mini-budget-item">
                  <div className="mini-budget-header">
                    <span className="mini-budget-label">{b.label}</span>
                  </div>
                  <ProgressBar value={spent} max={b.limit} color={b.color} />
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}


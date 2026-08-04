import { useState, useMemo } from "react";
import "./TransactionList.css";
import TransactionCard from "../components/TransactionCard";
import { Search, Filter } from "lucide-react";

export default function TransactionList({ transactions, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredAndSorted = useMemo(() => {
    let result = transactions.filter((t) => {
      const matchSearch = t.note.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === "all" || t.type === filterType;
      return matchSearch && matchType;
    });

    result.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
      if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortBy === "amount_desc") return b.amount - a.amount;
      if (sortBy === "amount_asc") return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [transactions, searchTerm, filterType, sortBy]);

  const grouped = useMemo(() => {
    const groups = {};
    filteredAndSorted.forEach((t) => {
      if (!groups[t.date]) groups[t.date] = [];
      groups[t.date].push(t);
    });
    return groups;
  }, [filteredAndSorted]);

  const formatMoney = (val) => new Intl.NumberFormat("vi-VN").format(val);

  return (
    <div className="transaction-list-page animate-in">
      <header className="page-header">
        <div className="title-row">
          <h1 className="page-title">Giao dịch</h1>
          <span className="count-badge">{filteredAndSorted.length}</span>
        </div>
        
        <div className="search-bar glass-card">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm giao dịch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="filters-row">
        <div className="type-filters">
          <button className={`filter-pill ${filterType === "all" ? "active" : ""}`} onClick={() => setFilterType("all")}>Tất cả</button>
          <button className={`filter-pill ${filterType === "income" ? "active" : ""}`} onClick={() => setFilterType("income")}>Thu nhập</button>
          <button className={`filter-pill ${filterType === "expense" ? "active" : ""}`} onClick={() => setFilterType("expense")}>Chi tiêu</button>
        </div>
        
        <div className="sort-dropdown glass-card">
          <Filter size={16} />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="amount_desc">Nhiều nhất</option>
            <option value="amount_asc">Ít nhất</option>
          </select>
        </div>
      </div>

      <div className="transactions-container">
        {Object.entries(grouped).map(([date, txs]) => {
          const dailyTotal = txs.reduce((sum, t) => sum + (t.type === "income" ? t.amount : -t.amount), 0);
          return (
            <div key={date} className="date-group">
              <div className="date-header">
                <span className="date-label">{new Date(date).toLocaleDateString("vi-VN", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" })}</span>
                <span className={`date-total mono ${dailyTotal >= 0 ? "text-income" : "text-expense"}`}>
                  {dailyTotal > 0 ? "+" : ""}{formatMoney(dailyTotal)} ₫
                </span>
              </div>
              <div className="date-txs">
                {txs.map((t) => (
                  <TransactionCard key={t.id} transaction={t} onDelete={onDelete} />
                ))}
              </div>
            </div>
          );
        })}
        {filteredAndSorted.length === 0 && (
          <div className="empty-state">
            <p>Không tìm thấy giao dịch nào</p>
          </div>
        )}
      </div>
    </div>
  );
}


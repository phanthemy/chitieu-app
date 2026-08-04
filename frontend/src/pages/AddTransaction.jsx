import { useState } from "react";
import "./AddTransaction.css";
import { Wallet, Utensils, Car, Home, ShoppingBag, Zap, Heart, Gamepad2, Laptop, MoreHorizontal } from "lucide-react";

const categories = [
  { id: "salary", label: "Lương", icon: Wallet, type: "income", color: "#34D399" },
  { id: "freelance", label: "Freelance", icon: Laptop, type: "income", color: "#34D399" },
  { id: "food", label: "Ăn uống", icon: Utensils, type: "expense", color: "#F87171" },
  { id: "transport", label: "Đi lại", icon: Car, type: "expense", color: "#FBBF24" },
  { id: "rent", label: "Thuê nhà", icon: Home, type: "expense", color: "#60A5FA" },
  { id: "shopping", label: "Mua sắm", icon: ShoppingBag, type: "expense", color: "#A78BFA" },
  { id: "bills", label: "Hóa đơn", icon: Zap, type: "expense", color: "#38BDF8" },
  { id: "health", label: "Sức khỏe", icon: Heart, type: "expense", color: "#34D399" },
  { id: "entertainment", label: "Giải trí", icon: Gamepad2, type: "expense", color: "#F472B6" },
  { id: "other", label: "Khác", icon: MoreHorizontal, type: "expense", color: "#94A3B8" },
];

export default function AddTransaction({ onAdd, navigate }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("food");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !category || !date) return;
    onAdd({
      type,
      amount: Number(amount.replace(/\D/g, "")),
      category,
      note,
      date,
    });
  };

  const handleAmountChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setAmount(val);
  };

  const availableCategories = categories.filter((c) => c.type === type || c.id === "other");

  return (
    <div className="add-tx-page animate-in">
      <div className="add-tx-card glass-card">
        <h1 className="page-title text-center">Thêm Giao Dịch</h1>
        
        <div className="type-switcher">
          <button className={`switch-btn ${type === "expense" ? "active" : ""}`} onClick={() => setType("expense")}>Chi tiêu</button>
          <button className={`switch-btn ${type === "income" ? "active" : ""}`} onClick={() => setType("income")}>Thu nhập</button>
          <div className="switch-indicator" style={{ left: type === "expense" ? "0" : "50%" }} />
        </div>

        <form onSubmit={handleSubmit} className="add-tx-form">
          <div className="form-group amount-group">
            <input
              type="text"
              className="amount-input mono"
              placeholder="0"
              value={amount ? new Intl.NumberFormat("vi-VN").format(Number(amount)) : ""}
              onChange={handleAmountChange}
              required
            />
            <span className="currency-label">VND</span>
          </div>

          <div className="form-group">
            <label>Danh mục</label>
            <div className="category-grid">
              {availableCategories.map((c) => (
                <div
                  key={c.id}
                  className={`category-chip ${category === c.id ? "active" : ""}`}
                  onClick={() => setCategory(c.id)}
                  style={{ "--cat-color": c.color }}
                >
                  <c.icon size={20} />
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Ghi chú</label>
            <input
              type="text"
              placeholder="Ví dụ: Ăn trưa cùng bạn"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Ngày</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-gradient submit-btn">Lưu Giao Dịch</button>
        </form>
      </div>
    </div>
  );
}


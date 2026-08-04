import { Wallet, Utensils, Car, Home, ShoppingBag, Zap, Heart, Gamepad2, Laptop, MoreHorizontal, X } from "lucide-react";
import "./TransactionCard.css";

const categoryIcons = {
  salary: Wallet,
  food: Utensils,
  transport: Car,
  rent: Home,
  shopping: ShoppingBag,
  bills: Zap,
  health: Heart,
  entertainment: Gamepad2,
  freelance: Laptop,
  other: MoreHorizontal,
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

const TransactionCard = ({ transaction, onDelete }) => {
  const Icon = categoryIcons[transaction.category] || MoreHorizontal;
  const isIncome = transaction.type === "income";
  const amountStr = new Intl.NumberFormat("vi-VN").format(transaction.amount);

  return (
    <div className="transaction-card glass-card">
      <div className="tx-left">
        <div 
          className="tx-icon" 
          style={{ 
            background: `linear-gradient(135deg, ${categoryColors[transaction.category]}80, ${categoryColors[transaction.category]}40)` 
          }}
        >
          <Icon size={20} color={categoryColors[transaction.category]} />
        </div>
        <div className="tx-details">
          <div className="tx-note">{transaction.note}</div>
          <div className="tx-category">{categoryNames[transaction.category] || "Khác"}</div>
        </div>
      </div>
      
      <div className="tx-right">
        <div className={`tx-amount mono ${isIncome ? "text-income" : "text-expense"}`}>
          {isIncome ? "+" : "-"}{amountStr} ₫
        </div>
        {onDelete && (
          <button className="tx-delete" onClick={() => onDelete(transaction.id)}>
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionCard;


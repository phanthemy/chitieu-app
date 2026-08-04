import { LayoutDashboard, ArrowLeftRight, Plus, PieChart, User, LogOut } from "lucide-react";
import "./Navbar.css";

const Navbar = ({ route, navigate, onLogout, user }) => {
  const navItems = [
    { id: "dashboard", path: "/dashboard", icon: LayoutDashboard, label: "Tổng quan" },
    { id: "transactions", path: "/transactions", icon: ArrowLeftRight, label: "Giao dịch" },
    { id: "add", path: "/add", icon: Plus, label: "Thêm mới", isAdd: true },
    { id: "budget", path: "/budget", icon: PieChart, label: "Ngân sách" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="desktop-sidebar">
        <div className="brand-logo">
          <div className="logo-icon">S</div>
        </div>
        
        <div className="nav-menu">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${route === item.path ? "active" : ""}`}
              onClick={() => navigate(item.path)}
              title={item.label}
            >
              <item.icon size={24} />
              <span className="tooltip">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="nav-bottom">
          <div className="user-profile" title={user?.name || "User"}>
            <User size={24} />
          </div>
          <button className="nav-item logout-btn" onClick={onLogout} title="Đăng xuất">
            <LogOut size={24} />
            <span className="tooltip">Đăng xuất</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="mobile-bottom-bar">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`mobile-nav-item ${route === item.path ? "active" : ""} ${item.isAdd ? "mobile-add-btn" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <item.icon size={item.isAdd ? 28 : 24} />
            {!item.isAdd && <span>{item.label}</span>}
          </button>
        ))}
        <button className="mobile-nav-item" onClick={onLogout}>
          <User size={24} />
          <span>Hồ sơ</span>
        </button>
      </nav>
    </>
  );
};

export default Navbar;


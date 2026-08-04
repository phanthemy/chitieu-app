import { useState } from "react";
import "./LoginPage.css";
import { User, Lock, Mail, Globe } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ name: isLogin ? "Người dùng" : formData.name, email: formData.email });
  };

  return (
    <div className="login-page">
      <div className="login-card glass-card">
        <div className="login-header">
          <h1 className="brand-title">SpendWise</h1>
          <p className="brand-tagline">Quản lý chi tiêu thông minh</p>
        </div>

        <div className="toggle-container">
          <button className={`toggle-btn ${isLogin ? "active" : ""}`} onClick={() => setIsLogin(true)}>
            Đăng nhập
          </button>
          <button className={`toggle-btn ${!isLogin ? "active" : ""}`} onClick={() => setIsLogin(false)}>
            Đăng ký
          </button>
          <div className="toggle-indicator" style={{ left: isLogin ? "0" : "50%" }} />
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="input-group">
              <User className="input-icon" size={20} />
              <input
                type="text"
                required
                placeholder="Họ và tên"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              required
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input
              type="password"
              required
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-gradient submit-btn">
            {isLogin ? "Đăng nhập" : "Tạo tài khoản"}
          </button>
        </form>

        <div className="divider">hoặc</div>

        <button className="social-btn">
          <Globe size={20} />
          <span>Tiếp tục với Google</span>
        </button>
      </div>
    </div>
  );
}


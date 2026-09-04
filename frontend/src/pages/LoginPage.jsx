import { useState } from 'react'
import './LoginPage.css'

const API_BASE = '/api'

export default function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.email || !formData.password) {
        setError('Vui lòng điền đầy đủ thông tin')
        setLoading(false)
        return
      }

      if (isSignUp) {
        if (!formData.name) {
          setError('Vui lòng nhập họ tên')
          setLoading(false)
          return
        }
        // Register new account
        const regRes = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name
          })
        })
        const regData = await regRes.json()
        if (!regRes.ok) {
          if (regData.error === 'Email already in use') {
            setError('Email đã được sử dụng. Vui lòng đăng nhập.')
          } else {
            setError(regData.error || 'Đăng ký thất bại. Thử lại.')
          }
          setLoading(false)
          return
        }
      }

      // Login
      const loginRes = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })
      const loginData = await loginRes.json()

      if (!loginRes.ok) {
        setError('Email hoặc mật khẩu không đúng')
        setLoading(false)
        return
      }

      // Save JWT token
      localStorage.setItem('token', loginData.token)
      onLogin({
        name: loginData.name || formData.name || formData.email.split('@')[0],
        email: formData.email,
        userId: loginData.userId,
      })
    } catch (err) {
      console.error('Login error:', err)
      setError('Lỗi kết nối máy chủ. Vui lòng thử lại.')
    }
    setLoading(false)
  }

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-bg-orb login-bg-orb-1" />
      <div className="login-bg-orb login-bg-orb-2" />
      <div className="login-bg-orb login-bg-orb-3" />
      
      <div className="login-container animate-fade-in-up">
        {/* Left panel - Branding */}
        <div className="login-hero">
          <div className="login-hero-content">
            <div className="login-logo">
              <span className="login-logo-icon">💸</span>
              <span className="login-logo-text gradient-text">SpendWise</span>
            </div>
            <h1 className="login-hero-title">
              Quản lý chi tiêu <br/>
              <span className="gradient-text">thông minh hơn</span>
            </h1>
            <p className="login-hero-desc">
              Theo dõi thu chi, lập ngân sách và phân tích tài chính cá nhân với giao diện hiện đại, trực quan.
            </p>
            <div className="login-features">
              <div className="login-feature">
                <span className="feature-icon">📊</span>
                <span>Biểu đồ trực quan</span>
              </div>
              <div className="login-feature">
                <span className="feature-icon">🎯</span>
                <span>Quản lý ngân sách</span>
              </div>
              <div className="login-feature">
                <span className="feature-icon">🔒</span>
                <span>Bảo mật tuyệt đối</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Form */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="login-form-header">
              <h2>{isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}</h2>
              <p>{isSignUp ? 'Bắt đầu quản lý tài chính của bạn' : 'Chào mừng bạn trở lại!'}</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {isSignUp && (
                <div className="form-group animate-fade-in-up">
                  <label className="form-label">Họ tên</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      className="form-input input-with-icon"
                      placeholder="Nhập họ tên của bạn"
                      value={formData.name}
                      onChange={handleChange('name')}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    className="form-input input-with-icon"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange('email')}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>
                  <input
                    type="password"
                    className="form-input input-with-icon"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange('password')}
                  />
                </div>
              </div>

              {error && (
                <div className="login-error animate-fade-in">
                  ⚠️ {error}
                </div>
              )}

              <button 
                type="submit" 
                className={`btn btn-primary btn-full btn-lg ${loading ? 'btn-loading' : ''}`}
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                ) : (
                  isSignUp ? '🚀 Tạo tài khoản' : '🔐 Đăng nhập'
                )}
              </button>
            </form>

            <div className="login-divider">
              <span>hoặc</span>
            </div>

            <p className="login-toggle">
              {isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}
              <button 
                className="login-toggle-btn"
                onClick={() => { setIsSignUp(!isSignUp); setError('') }}
              >
                {isSignUp ? 'Đăng nhập' : 'Đăng ký ngay'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

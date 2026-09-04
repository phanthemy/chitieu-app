import { useState, useEffect } from 'react'
import './Navbar.css'

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Tổng quan', icon: '📊' },
  { path: '/transactions', label: 'Giao dịch', icon: '📋' },
  { path: '/add', label: '', icon: '➕', isCenter: true },
  { path: '/budget', label: 'Ngân sách', icon: '💎' },
]

export default function Navbar({ route, navigate, onLogout, user }) {
  const [scrolled, setScrolled] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav className={`navbar-top ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-top-inner">
          <div className="navbar-brand" onClick={() => navigate('/dashboard')}>
            <span className="brand-icon">💸</span>
            <span className="brand-text gradient-text">SpendWise</span>
          </div>

          <div className="navbar-top-links hide-mobile">
            {NAV_ITEMS.filter(i => !i.isCenter).map(item => (
              <button
                key={item.path}
                className={`nav-top-link ${route === item.path ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span className="nav-top-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/add')}
            >
              ➕ Thêm mới
            </button>
          </div>

          <div className="navbar-user hide-mobile">
            <div className="user-avatar" onClick={() => setShowMenu(!showMenu)}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            {showMenu && (
              <div className="user-menu animate-scale-in">
                <div className="user-menu-header">
                  <div className="user-menu-name">{user?.name || 'User'}</div>
                  <div className="user-menu-email">{user?.email || 'user@email.com'}</div>
                </div>
                <div className="user-menu-divider" />
                <button className="user-menu-item" onClick={onLogout}>
                  🚪 Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="navbar-bottom">
        {NAV_ITEMS.map(item => (
          <button
            key={item.path}
            className={`nav-bottom-item ${item.isCenter ? 'nav-center-btn' : ''} ${route === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.isCenter ? (
              <div className="nav-center-circle">
                <span>{item.icon}</span>
              </div>
            ) : (
              <>
                <span className="nav-bottom-icon">{item.icon}</span>
                <span className="nav-bottom-label">{item.label}</span>
              </>
            )}
          </button>
        ))}
        <button
          className={`nav-bottom-item`}
          onClick={onLogout}
        >
          <span className="nav-bottom-icon">👤</span>
          <span className="nav-bottom-label">Tài khoản</span>
        </button>
      </nav>
    </>
  )
}

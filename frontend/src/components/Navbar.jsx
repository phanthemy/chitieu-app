import React, { useState, useEffect } from 'react'
import { LayoutDashboard, Receipt, PieChart, Plus, LogOut, User } from 'lucide-react'
import './Navbar.css'

export default function Navbar({ route, navigate, onLogout, user }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    { path: '/transactions', icon: Receipt, label: 'Giao dịch' },
    { path: '/add', icon: Plus, label: 'Thêm mới', isFab: true },
    { path: '/budget', icon: PieChart, label: 'Ngân sách' },
    { path: '#logout', icon: LogOut, label: 'Đăng xuất', onClick: onLogout }
  ]

  if (isMobile) {
    return (
      <nav className="bottom-nav">
        {navItems.map((item, index) => {
          const isActive = route === item.path
          const Icon = item.icon
          
          if (item.isFab) {
            return (
              <button 
                key={index} 
                className="bottom-nav-fab-wrapper"
                onClick={() => navigate('/add')}
              >
                <div className="bottom-nav-fab">
                  <Icon size={24} color="white" />
                </div>
              </button>
            )
          }

          return (
            <button 
              key={index}
              className={`bottom-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => item.onClick ? item.onClick() : navigate(item.path)}
            >
              <Icon size={24} />
              {isActive && <div className="active-dot"></div>}
            </button>
          )
        })}
      </nav>
    )
  }

  return (
    <nav className="sidebar">
      <div className="sidebar-top">
        <div className="brand-logo">
          <div className="logo-circle">S</div>
          <span className="brand-text title-font">SpendWise</span>
        </div>
        
        <div className="nav-links">
          {navItems.filter(i => !i.isFab && !i.onClick).map((item, index) => {
            const isActive = route === item.path
            const Icon = item.icon
            return (
              <button
                key={index}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                title={item.label}
              >
                <div className="icon-wrapper">
                  <Icon size={22} />
                </div>
                <span className="nav-label">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
      
      <div className="sidebar-bottom">
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-email">{user?.email || 'user@example.com'}</span>
          </div>
        </div>
        <button className="nav-item logout" onClick={onLogout} title="Đăng xuất">
          <div className="icon-wrapper">
            <LogOut size={22} />
          </div>
          <span className="nav-label">Đăng xuất</span>
        </button>
      </div>
    </nav>
  )
}

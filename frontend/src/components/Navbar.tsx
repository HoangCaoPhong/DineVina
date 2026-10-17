import React, { useState } from 'react'
import {
  UtensilsCrossed,
  Calendar,
  Store,
  ShieldCheck,
  Bell,
  PartyPopper,
  X,
  MapPin,
  ChevronDown,
  LogOut,
  User as UserIcon,
  LogIn
} from 'lucide-react'
import { User, NotificationItem } from '../types'

interface NavbarProps {
  currentTab: string
  setCurrentTab: (tab: string) => void
  currentUser: User | null
  currentRole: 'customer' | 'partner' | 'admin'
  onOpenLogin: () => void
  onLogout: () => void
  notifications: NotificationItem[]
  onMarkNotificationRead: (id: string) => void
  myReservationsCount: number
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  currentRole,
  onOpenLogin,
  onLogout,
  notifications,
  onMarkNotificationRead,
  myReservationsCount
}) => {
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [selectedCity, setSelectedCity] = useState('TP. Hồ Chí Minh')
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="navbar">
      {/* Brand & City Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div className="brand-container" onClick={() => setCurrentTab('discovery')}>
          <div className="brand-icon">
            <UtensilsCrossed size={22} />
          </div>
          <div className="brand-title-wrap">
            <div className="brand-name">
              Dine<span>Vina</span>
            </div>
            <div className="brand-tagline">Đặt Bàn Nhà Hàng & Ưu Đãi Giờ Vàng</div>
          </div>
        </div>

        {/* City Location Selector (moved into main white navbar) */}
        <div className="city-selector-chip">
          <MapPin size={15} color="var(--pasgo-red)" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="city-select-input"
          >
            <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
            <option value="Hà Nội">Hà Nội</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
          </select>
          <ChevronDown size={14} color="#64748b" />
        </div>
      </div>

      {/* Navigation tabs */}
      <nav>
        <ul className="nav-links">
          <li>
            <button
              className={`nav-link ${currentTab === 'discovery' ? 'active' : ''}`}
              onClick={() => setCurrentTab('discovery')}
            >
              <UtensilsCrossed size={16} />
              Khám phá nhà hàng
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setCurrentTab('bookings')}
            >
              <Calendar size={16} />
              Lịch đặt bàn
              {myReservationsCount > 0 && (
                <span
                  style={{
                    background: 'var(--pasgo-red)',
                    color: '#fff',
                    fontSize: '0.72rem',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    marginLeft: '2px',
                    fontWeight: 800
                  }}
                >
                  {myReservationsCount}
                </span>
              )}
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentTab === 'events' ? 'active' : ''}`}
              onClick={() => setCurrentTab('events')}
            >
              <PartyPopper size={16} />
              Đặt tiệc & Sự kiện
            </button>
          </li>

          {currentRole === 'partner' && (
            <li>
              <button
                className={`nav-link ${currentTab === 'partner' ? 'active' : ''}`}
                onClick={() => setCurrentTab('partner')}
                style={{ color: '#0284c7', background: '#f0f9ff', border: '1px solid #bae6fd' }}
              >
                <Store size={16} />
                Kênh Đối Tác
              </button>
            </li>
          )}

          {currentRole === 'admin' && (
            <li>
              <button
                className={`nav-link ${currentTab === 'admin' ? 'active' : ''}`}
                onClick={() => setCurrentTab('admin')}
                style={{ color: '#059669', background: '#ecfdf5', border: '1px solid #a7f3d0' }}
              >
                <ShieldCheck size={16} />
                Admin Duyệt
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Right actions: Notifications & User profile/Login button */}
      <div className="nav-actions">
        {/* Notifications Bell */}
        <div style={{ position: 'relative' }}>
          <button
            className="notif-bell-btn"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
            title="Thông báo đơn đặt bàn"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showNotifDropdown && (
            <div
              style={{
                position: 'absolute',
                top: '46px',
                right: '0',
                width: '320px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                zIndex: 1000,
                padding: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '0.4rem',
                  borderBottom: '1px solid #f1f5f9'
                }}
              >
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e293b' }}>
                  Thông báo ({unreadCount})
                </span>
                <button
                  onClick={() => setShowNotifDropdown(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div
                style={{
                  maxHeight: '280px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                {notifications.length === 0 ? (
                  <div
                    style={{ color: '#94a3b8', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}
                  >
                    Chưa có thông báo nào
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        onMarkNotificationRead(n.id)
                        if (n.link === '/my-bookings') setCurrentTab('bookings')
                        setShowNotifDropdown(false)
                      }}
                      style={{
                        padding: '0.65rem',
                        borderRadius: 'var(--radius-xs)',
                        background: n.read ? '#ffffff' : '#fff1f2',
                        border: n.read ? '1px solid #e2e8f0' : '1px solid #fecdd3',
                        cursor: 'pointer',
                        fontSize: '0.8rem'
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          color: n.read ? '#334155' : 'var(--pasgo-red)',
                          marginBottom: '2px'
                        }}
                      >
                        {n.title}
                      </div>
                      <div style={{ color: '#475569', lineHeight: 1.35, fontSize: '0.78rem' }}>
                        {n.message}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px' }}>
                        {n.created_at}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Account or Login Button */}
        {currentUser ? (
          <div style={{ position: 'relative' }}>
            <div
              className="user-chip"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              style={{ cursor: 'pointer' }}
              title="Xem thông tin tài khoản & đăng xuất"
            >
              <img
                src={currentUser.avatar_url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"}
                alt={currentUser.full_name}
                className="user-avatar"
              />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
                <span className="user-name">{currentUser.full_name}</span>
                <span style={{ fontSize: '0.68rem', color: 'var(--pasgo-red)', fontWeight: 700 }}>
                  {currentUser.role === 'customer'
                    ? '👤 Thực khách'
                    : currentUser.role === 'partner'
                    ? '🏪 Đối tác'
                    : '🛡️ Admin'}
                </span>
              </div>
              <ChevronDown size={14} color="#64748b" />
            </div>

            {/* Account Dropdown */}
            {showUserDropdown && (
              <div
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: '0',
                  width: '240px',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 1000,
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1e293b' }}>
                    {currentUser.full_name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{currentUser.email}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>SĐT: {currentUser.phone}</div>
                </div>

                <button
                  onClick={() => {
                    setShowUserDropdown(false)
                    onOpenLogin()
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-xs)',
                    color: '#334155',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <UserIcon size={15} color="var(--pasgo-red)" />
                  Đổi tài khoản / Đăng nhập lại
                </button>

                <button
                  onClick={() => {
                    setShowUserDropdown(false)
                    onLogout()
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem',
                    background: '#fef2f2',
                    border: 'none',
                    borderRadius: 'var(--radius-xs)',
                    color: '#b91c1c',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <LogOut size={15} color="#b91c1c" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="nav-login-btn" onClick={onOpenLogin}>
            <LogIn size={16} />
            <span>Đăng nhập / Đăng ký</span>
          </button>
        )}
      </div>
    </header>
  )
}

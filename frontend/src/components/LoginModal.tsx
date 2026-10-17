import React, { useState } from 'react'
import {
  X,
  User as UserIcon,
  Store,
  ShieldCheck,
  Mail,
  Lock,
  Phone,
  Sparkles
} from 'lucide-react'
import { User } from '../types'
import { loginUser, registerUser } from '../api'

interface LoginModalProps {
  onClose: () => void
  onLoginSuccess: (user: User) => void
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'customer' | 'partner'>('customer')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Quick 1-click Demo Accounts
  const handleQuickLogin = async (targetRole: 'customer' | 'partner' | 'admin') => {
    setSubmitting(true)
    setErrorMsg('')
    try {
      const user = await loginUser({ role: targetRole })
      onLoginSuccess(user)
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi đăng nhập nhanh')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMsg('')

    try {
      if (mode === 'login') {
        const user = await loginUser({ email, password })
        onLoginSuccess(user)
      } else {
        const user = await registerUser({
          email,
          password,
          full_name: fullName,
          phone,
          role
        })
        onLoginSuccess(user)
      }
      onClose()
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi xử lý tài khoản')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--pasgo-red)', fontWeight: 800, textTransform: 'uppercase' }}>
              DineVina Passport · Group 1
            </div>
            <h2 className="modal-title">
              {mode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Đăng Ký Tài Khoản Mới'}
            </h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc'
        }}>
          <button
            onClick={() => setMode('login')}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'transparent',
              border: 'none',
              borderBottom: mode === 'login' ? '2.5px solid var(--pasgo-red)' : '2.5px solid transparent',
              color: mode === 'login' ? 'var(--pasgo-red)' : '#64748b',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Đăng Nhập
          </button>
          <button
            onClick={() => setMode('register')}
            style={{
              flex: 1,
              padding: '0.75rem',
              background: 'transparent',
              border: 'none',
              borderBottom: mode === 'register' ? '2.5px solid var(--pasgo-red)' : '2.5px solid transparent',
              color: mode === 'register' ? 'var(--pasgo-red)' : '#64748b',
              fontWeight: 800,
              fontSize: '0.88rem',
              cursor: 'pointer'
            }}
          >
            Đăng Ký Mới
          </button>
        </div>

        <div className="modal-body">
          {errorMsg && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem'
            }}>
              {errorMsg}
            </div>
          )}

          {/* Quick Demo Login Preset Buttons */}
          {mode === 'login' && (
            <div style={{
              background: '#fff1f2',
              border: '1px dashed var(--pasgo-red-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.9rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: 'var(--pasgo-red)',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Sparkles size={14} />
                Tài khoản mẫu để trải nghiệm hệ thống:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('customer')}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.6rem 0.4rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--pasgo-red)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                >
                  <UserIcon size={16} color="var(--pasgo-red)" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b' }}>Khách hàng</span>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Nguyễn Văn A</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('partner')}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.6rem 0.4rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0284c7')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                >
                  <Store size={16} color="#0284c7" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b' }}>Đối tác</span>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Quản lý nhà hàng</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: 'var(--radius-xs)',
                    padding: '0.6rem 0.4rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#059669')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                >
                  <ShieldCheck size={16} color="#059669" />
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e293b' }}>Admin</span>
                  <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Quản trị viên</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label className="form-label">Họ và tên:</label>
                  <div className="input-group">
                    <UserIcon size={16} />
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Nguyễn Văn A"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Số điện thoại:</label>
                  <div className="input-group">
                    <Phone size={16} />
                    <input
                      type="tel"
                      className="input-field"
                      placeholder="0912 345 678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Loại tài khoản đăng ký:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setRole('customer')}
                      style={{
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-xs)',
                        border: role === 'customer' ? '2px solid var(--pasgo-red)' : '1px solid #cbd5e1',
                        background: role === 'customer' ? 'var(--pasgo-red-light)' : '#fff',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        color: role === 'customer' ? 'var(--pasgo-red)' : '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      Thực khách đặt bàn
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('partner')}
                      style={{
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-xs)',
                        border: role === 'partner' ? '2px solid var(--pasgo-red)' : '1px solid #cbd5e1',
                        background: role === 'partner' ? 'var(--pasgo-red-light)' : '#fff',
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        color: role === 'partner' ? 'var(--pasgo-red)' : '#475569',
                        cursor: 'pointer'
                      }}
                    >
                      Chủ nhà hàng (Đối tác)
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Địa chỉ Email:</label>
              <div className="input-group">
                <Mail size={16} />
                <input
                  type="email"
                  className="input-field"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mật khẩu:</label>
              <div className="input-group">
                <Lock size={16} />
                <input
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
              disabled={submitting}
            >
              {submitting
                ? 'Đang xử lý...'
                : mode === 'login'
                ? 'Đăng nhập'
                : 'Đăng ký tài khoản'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

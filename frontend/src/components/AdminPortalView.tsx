import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'
import { adminListVenues, adminApproveVenue } from '../api'

interface AdminPortalProps {
  onRefreshAll: () => void
}

export const AdminPortalView: React.FC<AdminPortalProps> = ({ onRefreshAll }) => {
  const [venues, setVenues] = useState<any[]>([])
  const [msg, setMsg] = useState('')

  const loadVenues = async () => {
    try {
      const data = await adminListVenues()
      setVenues(data)
    } catch (err: any) {
      console.error(err)
    }
  }

  useEffect(() => {
    loadVenues()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await adminApproveVenue(id)
      setMsg('Đã phê duyệt nhà hàng thành công! Nhà hàng đã xuất hiện trên trang tìm kiếm.')
      loadVenues()
      onRefreshAll()
    } catch (err: any) {
      alert('Lỗi phê duyệt')
    }
  }

  const submittedVenues = venues.filter((v) => v.status === 'submitted')
  const approvedVenues = venues.filter((v) => v.status === 'approved')

  return (
    <div className="main-content">
      <div className="section-header-row">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#34d399', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
            <ShieldCheck size={16} />
            Kênh Quản Trị Hệ Thống (Group 2: Restaurant Onboarding)
          </div>
          <h1 className="section-title">Hàng Đợi Duyệt Hồ Sơ Nhà Hàng</h1>
          <p className="section-subtitle">
            Kiểm tra chất lượng dữ liệu, hình ảnh, địa chỉ và thông tin liên hệ của đối tác trước khi kích hoạt hiển thị công khai.
          </p>
        </div>
      </div>

      {msg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#6ee7b7',
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={16} />
          <span>{msg}</span>
        </div>
      )}

      {/* Submitted Venues Queue */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
        Hồ Sơ Mới Nộp Chờ Duyệt ({submittedVenues.length})
      </h2>

      {submittedVenues.length === 0 ? (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--text-tertiary)',
          marginBottom: '2rem'
        }}>
          Hiện không có hồ sơ nhà hàng nào cần phê duyệt.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {submittedVenues.map((v) => (
            <div
              key={v.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{v.name}</h3>
                  <span className="status-pill pending">Chờ duyệt (Submitted)</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Ẩm thực: <strong>{v.cuisine}</strong> · Địa chỉ: {v.address}, {v.district} · SĐT: {v.contact_phone}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  {v.description}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  className="btn-primary"
                  style={{ background: '#10b981', padding: '0.6rem 1.2rem' }}
                  onClick={() => handleApprove(v.id)}
                >
                  <CheckCircle2 size={16} />
                  Phê duyệt xuất bản
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Approved Venues */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem' }}>
        Nhà Hàng Đang Hoạt Động Trên Hệ Thống ({approvedVenues.length})
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {approvedVenues.map((v) => (
          <div
            key={v.id}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              fontSize: '0.85rem'
            }}
          >
            <div style={{ fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{v.name}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
              {v.cuisine} · {v.district}
            </div>
            <div style={{ marginTop: '6px' }}>
              <span className="status-pill confirmed">Đang hoạt động (Approved)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

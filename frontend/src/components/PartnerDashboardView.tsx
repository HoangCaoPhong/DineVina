import React, { useState } from 'react'
import {
  Store,
  CheckCircle2,
  XCircle,
  Clock,
  PlusCircle
} from 'lucide-react'
import { Reservation, Venue } from '../types'
import {
  partnerConfirmReservation,
  partnerRejectReservation,
  partnerSubmitVenue
} from '../api'

interface PartnerDashboardProps {
  reservations: Reservation[]
  venues: Venue[]
  onRefresh: () => void
}

export const PartnerDashboardView: React.FC<PartnerDashboardProps> = ({
  reservations,
  venues,
  onRefresh
}) => {
  const [rejectingId, setRejectingId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('Hết bàn vào khung giờ này')
  const [showAddVenue, setShowAddVenue] = useState(false)
  const [actionMsg, setActionMsg] = useState('')

  // New venue form state (Group 2)
  const [venueName, setVenueName] = useState('')
  const [venueAddress, setVenueAddress] = useState('')
  const [venueDistrict, setVenueDistrict] = useState('Quận 1')
  const [venueCuisine, setVenueCuisine] = useState('Lẩu & Nướng')
  const [venuePrice, setVenuePrice] = useState('250.000đ - 400.000đ')
  const [venueHours, setVenueHours] = useState('10:00 - 22:30')
  const [venuePhone, setVenuePhone] = useState('028 3822 9999')
  const [venueDesc, setVenueDesc] = useState('')

  const pendingList = reservations.filter((r) => r.status === 'Pending')
  const confirmedList = reservations.filter((r) => r.status === 'Confirmed')
  const cancelledList = reservations.filter((r) => r.status === 'Cancelled')

  const handleConfirm = async (id: string) => {
    try {
      await partnerConfirmReservation(id)
      setActionMsg('Đã xác nhận giữ bàn thành công! Đã gửi thông báo cho khách.')
      onRefresh()
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xác nhận')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await partnerRejectReservation(id, rejectReason)
      setActionMsg('Đã từ chối đơn đặt bàn.')
      setRejectingId(null)
      onRefresh()
    } catch (err: any) {
      alert(err.message || 'Lỗi khi từ chối')
    }
  }

  const handleCreateVenue = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await partnerSubmitVenue({
        name: venueName,
        address: venueAddress,
        district: venueDistrict,
        cuisine: venueCuisine,
        price_range: venuePrice,
        opening_hours: venueHours,
        contact_phone: venuePhone,
        description: venueDesc
      })
      alert('Đã gửi hồ sơ nhà hàng lên hệ thống! Hồ sơ đang ở trạng thái Chờ duyệt (Submitted) của Admin.')
      setShowAddVenue(false)
      onRefresh()
    } catch (err: any) {
      alert('Lỗi đăng ký nhà hàng')
    }
  }

  return (
    <div className="main-content">
      {/* Header */}
      <div className="section-header-row">
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
            <Store size={16} />
            Kênh Dành Cho Đối Tác Nhà Hàng (Group 7 & Group 2)
          </div>
          <h1 className="section-title">Bảng Điều Khiển Quản Lý Đặt Bàn</h1>
          <p className="section-subtitle">
            Tiếp nhận yêu cầu đặt bàn tức thì, kiểm tra công suất ({venues.length} nhà hàng đối tác) và phản hồi cho thực khách.
          </p>
        </div>

        <button
          className="btn-primary"
          style={{ background: '#0284c7' }}
          onClick={() => setShowAddVenue(!showAddVenue)}
        >
          <PlusCircle size={16} />
          {showAddVenue ? 'Đóng form đăng ký' : 'Đăng ký thêm nhà hàng (Onboarding)'}
        </button>
      </div>

      {actionMsg && (
        <div style={{
          background: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          color: '#7dd3fc',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.88rem'
        }}>
          <CheckCircle2 size={16} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Metrics Row (Group 7 counters) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>Yêu cầu chờ duyệt</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            {pendingList.length}
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>Đã xác nhận</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            {confirmedList.length}
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>Đã hủy</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
            {cancelledList.length}
          </div>
        </div>

        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700 }}>Thời gian phản hồi TB</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
            14 phút
          </div>
        </div>
      </div>

      {/* Onboarding Form Drawer if toggled */}
      {showAddVenue && (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', color: '#38bdf8' }}>
            Đăng Ký Hồ Sơ Gian Hàng Nhà Hàng Mới (Restaurant Onboarding)
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
            Sau khi nộp hồ sơ, Quản trị viên (Admin) sẽ xét duyệt chất lượng trước khi nhà hàng xuất hiện trên công cụ tìm kiếm của thực khách.
          </p>
          <form onSubmit={handleCreateVenue} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Tên nhà hàng:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: Hải Sản Biển Đông - Thảo Điền"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Loại ẩm thực:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="VD: Hải sản tươi sống, Lẩu nướng..."
                  value={venueCuisine}
                  onChange={(e) => setVenueCuisine(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Địa chỉ:</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Số nhà, tên đường, phường..."
                  value={venueAddress}
                  onChange={(e) => setVenueAddress(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Khu vực / Quận:</label>
                <select
                  className="form-control"
                  value={venueDistrict}
                  onChange={(e) => setVenueDistrict(e.target.value)}
                >
                  <option value="Quận 1">Quận 1</option>
                  <option value="Quận 2">Quận 2</option>
                  <option value="Quận 3">Quận 3</option>
                  <option value="Quận 5">Quận 5</option>
                  <option value="Quận 7">Quận 7</option>
                  <option value="Bình Thạnh">Bình Thạnh</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Khoảng giá:</label>
                <input
                  type="text"
                  className="form-control"
                  value={venuePrice}
                  onChange={(e) => setVenuePrice(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Giờ mở cửa:</label>
                <input
                  type="text"
                  className="form-control"
                  value={venueHours}
                  onChange={(e) => setVenueHours(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại liên hệ:</label>
              <input
                type="text"
                className="form-control"
                value={venuePhone}
                onChange={(e) => setVenuePhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mô tả đặc trưng:</label>
              <textarea
                className="form-control"
                rows={2}
                value={venueDesc}
                onChange={(e) => setVenueDesc(e.target.value)}
                placeholder="Không gian sang trọng, chuyên hải sản đánh bắt trong ngày..."
              />
            </div>

            <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', padding: '0.75rem 1.5rem' }}>
              Nộp hồ sơ Onboarding cho Admin duyệt
            </button>
          </form>
        </div>
      )}

      {/* Incoming Requests Section */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Clock size={18} color="#fbbf24" />
        Yêu Cầu Đặt Bàn Chờ Xử Lý ({pendingList.length})
      </h2>

      {pendingList.length === 0 ? (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--text-secondary)',
          marginBottom: '2.5rem'
        }}>
          Hiện không có yêu cầu đặt bàn nào đang chờ duyệt.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
          {pendingList.map((res) => (
            <div
              key={res.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-glass)',
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
                  <strong style={{ fontSize: '1.05rem' }}>{res.customer_name}</strong>
                  <span style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>({res.customer_phone})</span>
                  <span className="status-pill pending">Mã: {res.confirmation_code}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Nhà hàng: <strong>{res.venue_name}</strong> · Ngày: <strong>{res.reserved_date}</strong> · Giờ: <strong>{res.reserved_time}</strong> · Khách: <strong>{res.party_size} người</strong>
                </div>
                {res.discount_percent > 0 && (
                  <div style={{ color: '#ef4444', fontSize: '0.82rem', fontWeight: 700, marginTop: '2px' }}>
                    ⚡ Ưu đãi Eatigo: Giảm {res.discount_percent}%
                  </div>
                )}
                {res.note && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                    Ghi chú của khách: <em>"{res.note}"</em>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                {rejectingId === res.id ? (
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-control"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Lý do từ chối..."
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem', width: '180px' }}
                    />
                    <button
                      className="btn-primary"
                      style={{ background: '#dc2626', padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => handleReject(res.id)}
                    >
                      Xác nhận từ chối
                    </button>
                    <button
                      className="btn-secondary"
                      style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}
                      onClick={() => setRejectingId(null)}
                    >
                      Hủy
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className="btn-secondary"
                      style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      onClick={() => setRejectingId(res.id)}
                    >
                      <XCircle size={15} />
                      Từ chối
                    </button>
                    <button
                      className="btn-primary"
                      style={{ background: '#10b981' }}
                      onClick={() => handleConfirm(res.id)}
                    >
                      <CheckCircle2 size={15} />
                      Xác nhận giữ bàn
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmed reservations summary */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CheckCircle2 size={18} color="#34d399" />
        Đơn Đặt Bàn Đã Xác Nhận Gần Đây ({confirmedList.length})
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {confirmedList.slice(0, 5).map((r) => (
          <div
            key={r.id}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '0.9rem 1.25rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.85rem'
            }}
          >
            <div>
              <strong>{r.customer_name}</strong> ({r.party_size} khách) · {r.venue_name}
              <div style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                Lịch hẹn: {r.reserved_time} ngày {r.reserved_date} · Mã: {r.confirmation_code}
              </div>
            </div>
            <span className="status-pill confirmed">Đã xác nhận</span>
          </div>
        ))}
      </div>
    </div>
  )
}

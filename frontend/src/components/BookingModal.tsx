import React, { useState } from 'react'
import {
  X,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react'
import { Venue, TimeSlotDiscount, Reservation } from '../types'
import { createReservation } from '../api'

interface BookingModalProps {
  venue: Venue
  initialSlot?: TimeSlotDiscount | null
  onClose: () => void
  onSuccess: (reservation: Reservation) => void
}

export const BookingModal: React.FC<BookingModalProps> = ({
  venue,
  initialSlot,
  onClose,
  onSuccess
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-18')
  const [selectedTime, setSelectedTime] = useState(initialSlot?.time || venue.time_slots[0]?.time || '18:00')
  const [selectedDiscount, setSelectedDiscount] = useState(initialSlot?.discount_percent || venue.time_slots[0]?.discount_percent || 0)
  const [partySize, setPartySize] = useState(2)
  const [customerName, setCustomerName] = useState('Nguyễn Trung Kiên')
  const [customerPhone, setCustomerPhone] = useState('0912 345 678')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [createdReservation, setCreatedReservation] = useState<Reservation | null>(null)

  const handleSlotClick = (slot: TimeSlotDiscount) => {
    setSelectedTime(slot.time)
    setSelectedDiscount(slot.discount_percent)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSubmitting(true)

    try {
      const res = await createReservation({
        venue_id: venue.id,
        customer_name: customerName,
        customer_phone: customerPhone,
        reserved_date: selectedDate,
        reserved_time: selectedTime,
        party_size: partySize,
        discount_percent: selectedDiscount,
        note: note
      })
      setCreatedReservation(res)
      onSuccess(res)
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tạo đơn đặt bàn')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--pasgo-red)', fontWeight: 800, textTransform: 'uppercase' }}>
              Đặt Bàn Giữ Chỗ Trực Tuyến
            </div>
            <h2 className="modal-title">{venue.name}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {createdReservation ? (
            /* Success confirmation */
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#ecfdf5',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>
                Yêu Cầu Đặt Bàn Đã Được Gửi!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                Mã xác nhận giữ chỗ: <strong style={{ color: 'var(--pasgo-red)', fontSize: '1.15rem' }}>{createdReservation.confirmation_code}</strong>
              </p>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                textAlign: 'left',
                fontSize: '0.88rem',
                marginBottom: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                color: '#1e293b'
              }}>
                <div><strong>Nhà hàng:</strong> {createdReservation.venue_name}</div>
                <div><strong>Thời gian dùng bữa:</strong> {createdReservation.reserved_time} ngày {createdReservation.reserved_date}</div>
                <div><strong>Số lượng khách:</strong> {createdReservation.party_size} người</div>
                {createdReservation.discount_percent > 0 && (
                  <div style={{ color: 'var(--pasgo-red)', fontWeight: 800 }}>
                    ⚡ Ưu đãi Eatigo áp dụng: Giảm {createdReservation.discount_percent}% tổng hóa đơn thức ăn
                  </div>
                )}
                <div><strong>Trạng thái ban đầu:</strong> <span className="status-pill pending">Chờ nhà hàng xác nhận (Pending)</span></div>
              </div>

              <button className="btn-primary" style={{ width: '100%', padding: '0.85rem' }} onClick={onClose}>
                Hoàn tất & Xem lịch sử đặt bàn
              </button>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {errorMsg && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem'
                }}>
                  {errorMsg}
                </div>
              )}

              {/* Step 1: Date & Party Size */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Ngày dùng bữa
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Số lượng khách
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '0.65rem 0.9rem' }}
                      onClick={() => setPartySize(Math.max(1, partySize - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control"
                      value={partySize}
                      onChange={(e) => setPartySize(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ textAlign: 'center' }}
                      min="1"
                      max="50"
                      required
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '0.65rem 0.9rem' }}
                      onClick={() => setPartySize(partySize + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 2: Time Slots & Eatigo Discounts */}
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label">
                    <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                    Khung giờ & Mức giảm giá Eatigo:
                  </label>
                  {selectedDiscount > 0 && (
                    <span style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 800 }}>
                      ⚡ Tiết kiệm -{selectedDiscount}%
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                  {venue.time_slots.map((slot, idx) => {
                    const isSelected = selectedTime === slot.time
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSlotClick(slot)}
                        style={{
                          background: isSelected ? '#fff1f2' : '#ffffff',
                          border: isSelected ? '2px solid var(--pasgo-red)' : '1px solid #cbd5e1',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.5rem 0.3rem',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'var(--transition)'
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isSelected ? 'var(--pasgo-red)' : '#1e293b' }}>
                          {slot.time}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: slot.discount_percent > 0 ? 'var(--pasgo-red)' : '#94a3b8'
                        }}>
                          {slot.discount_percent > 0 ? `-${slot.discount_percent}%` : 'Tiêu chuẩn'}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Step 3: Customer Information */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Họ tên người đặt</label>
                  <input
                    type="text"
                    className="form-control"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại nhận SMS xác nhận</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Step 4: Special Note */}
              <div className="form-group">
                <label className="form-label">Ghi chú đặc biệt (Tùy chọn)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ví dụ: Bàn gần cửa sổ, ghế trẻ em, kỷ niệm ngày cưới..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {/* Cancellation Policy Alert (Kien.md Specification) */}
              <div className="policy-alert-box">
                <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong>Chính sách hủy bàn & Đảm bảo giữ chỗ:</strong>
                  <div style={{ marginTop: '2px' }}>
                    • Yêu cầu bắt đầu ở trạng thái <code>Pending</code> và được đối tác xác nhận trong vòng 15 phút.
                    <br />
                    • Miễn phí hủy bàn trước giờ dùng bữa ít nhất <strong>{venue.cancellation_cutoff_hours} tiếng</strong>. Hủy sau thời hạn này hệ thống sẽ từ chối (409 Blocked).
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '0.85rem' }}
                disabled={submitting}
              >
                {submitting ? 'Đang gửi yêu cầu đặt bàn...' : `Xác Nhận Đặt Bàn ${selectedDiscount > 0 ? `(Giảm ${selectedDiscount}%)` : ''}`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

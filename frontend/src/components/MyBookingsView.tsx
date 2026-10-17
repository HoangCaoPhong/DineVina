import React, { useState } from 'react'
import {
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  History,
  XCircle,
  CheckCircle2,
  Star
} from 'lucide-react'
import { Reservation } from '../types'
import { cancelReservation, submitReview } from '../api'

interface MyBookingsViewProps {
  reservations: Reservation[]
  onRefresh: () => void
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  reservations,
  onRefresh
}) => {
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('Bận việc đột xuất')
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [reviewingRes, setReviewingRes] = useState<Reservation | null>(null)
  const [rating, setRating] = useState(5)
  const [reviewBody, setReviewBody] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const handleCancelSubmit = async (resId: string) => {
    setErrorMsg('')
    setSuccessMsg('')
    try {
      await cancelReservation(resId, cancelReason)
      setSuccessMsg('Đã hủy đặt bàn thành công theo chính sách hủy bàn.')
      setCancellingId(null)
      onRefresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể hủy đặt bàn')
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewingRes) return
    setSubmittingReview(true)
    setErrorMsg('')
    try {
      await submitReview(reviewingRes.id, rating, reviewBody)
      setSuccessMsg('Cảm ơn bạn đã gửi đánh giá nhà hàng!')
      setReviewingRes(null)
      setReviewBody('')
      onRefresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể gửi đánh giá')
    } finally {
      setSubmittingReview(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="status-pill pending">⏳ Chờ duyệt (Pending)</span>
      case 'Confirmed':
        return <span className="status-pill confirmed">✅ Đã xác nhận (Confirmed)</span>
      case 'Cancelled':
        return <span className="status-pill cancelled">✕ Đã hủy (Cancelled)</span>
      case 'Rejected':
        return <span className="status-pill rejected">🚫 Bị từ chối (Rejected)</span>
      default:
        return <span className="status-pill">{status}</span>
    }
  }

  return (
    <div className="main-content">
      <div className="section-header-row">
        <div>
          <h1 className="section-title">Lịch Sử & Quản Lý Đặt Bàn</h1>
          <p className="section-subtitle">
            Theo dõi trạng thái xác nhận từ nhà hàng và quản lý hủy bàn theo chính sách Cutoff.
          </p>
        </div>
      </div>

      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertTriangle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#6ee7b7',
          padding: '0.85rem',
          borderRadius: 'var(--radius-md)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {reservations.length === 0 ? (
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-lg)',
          padding: '3rem',
          textAlign: 'center',
          color: 'var(--text-secondary)'
        }}>
          <Calendar size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <h3>Bạn chưa có lịch đặt bàn nào</h3>
          <p style={{ marginTop: '0.4rem', fontSize: '0.9rem' }}>
            Hãy khám phá các nhà hàng ưu đãi trên DineVina và chọn cho mình một bàn thật ưng ý nhé!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {reservations.map((res) => (
            <div
              key={res.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: '140px 1fr auto',
                gap: '1.5rem',
                alignItems: 'start'
              }}
            >
              {/* Image & Code */}
              <div>
                <img
                  src={res.venue_image}
                  alt={res.venue_name}
                  style={{ width: '100%', height: '90px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                />
                <div style={{
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  marginTop: '0.4rem',
                  color: 'var(--pasgo-red)',
                  background: 'var(--pasgo-red-light)',
                  border: '1px solid var(--pasgo-red-border)',
                  padding: '3px 0',
                  borderRadius: '4px'
                }}>
                  {res.confirmation_code}
                </div>
              </div>

              {/* Details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b' }}>{res.venue_name}</h3>
                  {getStatusBadge(res.status)}
                </div>

                <div style={{ display: 'flex', gap: '1.25rem', color: '#475569', fontSize: '0.85rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={14} color="var(--pasgo-red)" />
                    {res.reserved_date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} color="#d97706" />
                    {res.reserved_time}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={14} color="#059669" />
                    {res.party_size} người
                  </span>
                  {res.discount_percent > 0 && (
                    <span style={{ color: 'var(--pasgo-red)', fontWeight: 800 }}>
                      ⚡ Ưu đãi giảm {res.discount_percent}%
                    </span>
                  )}
                </div>

                {res.note && (
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    <strong>Ghi chú:</strong> {res.note}
                  </div>
                )}

                {/* Status History (Audit Trail per Group 5) */}
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.75rem',
                  marginTop: '0.5rem'
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.5rem' }}>
                    <History size={12} color="var(--pasgo-red)" />
                    Lịch sử thay đổi trạng thái (Audit trail):
                  </div>
                  <div className="history-timeline">
                    {res.status_history.map((h, i) => (
                      <div key={i} className="timeline-entry">
                        <div className="timeline-title" style={{ color: '#1e293b' }}>
                          {h.from_status} → {h.to_status} ({h.actor_name})
                        </div>
                        <div className="timeline-sub" style={{ color: '#64748b' }}>
                          {h.changed_at} {h.reason ? `• ${h.reason}` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                {/* Cancel Action */}
                {res.can_cancel && (res.status === 'Pending' || res.status === 'Confirmed') && (
                  <div>
                    {cancellingId === res.id ? (
                      <div style={{
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-glass)',
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem'
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fca5a5' }}>
                          Xác nhận hủy đặt bàn?
                        </div>
                        <input
                          type="text"
                          className="form-control"
                          value={cancelReason}
                          onChange={(e) => setCancelReason(e.target.value)}
                          placeholder="Lý do hủy..."
                          style={{ fontSize: '0.75rem', padding: '0.35rem 0.5rem' }}
                        />
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            className="btn-secondary"
                            style={{ padding: '0.3rem', fontSize: '0.75rem', flex: 1 }}
                            onClick={() => setCancellingId(null)}
                          >
                            Đóng
                          </button>
                          <button
                            className="btn-primary"
                            style={{
                              padding: '0.3rem',
                              fontSize: '0.75rem',
                              flex: 1,
                              background: '#dc2626'
                            }}
                            onClick={() => handleCancelSubmit(res.id)}
                          >
                            Xác nhận hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn-secondary"
                        style={{ width: '100%', color: '#fca5a5', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                        onClick={() => {
                          setCancellingId(res.id)
                          setErrorMsg('')
                        }}
                      >
                        <XCircle size={15} />
                        Hủy đặt bàn
                      </button>
                    )}
                  </div>
                )}

                {/* Review Action (Group 11) */}
                {res.status === 'Confirmed' && (
                  <button
                    className="btn-secondary"
                    style={{ width: '100%', color: '#fbbf24', borderColor: 'rgba(251, 191, 36, 0.3)' }}
                    onClick={() => setReviewingRes(res)}
                  >
                    <Star size={15} />
                    Đánh giá nhà hàng
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Dialog Modal */}
      {reviewingRes && (
        <div className="modal-overlay" onClick={() => setReviewingRes(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Đánh Giá {reviewingRes.venue_name}</h3>
              <button className="modal-close-btn" onClick={() => setReviewingRes(null)}>
                <XCircle size={18} />
              </button>
            </div>
            <form onSubmit={handleReviewSubmit} className="modal-body">
              <div className="form-group">
                <label className="form-label">Chọn số sao đánh giá:</label>
                <div style={{ display: 'flex', gap: '0.5rem', color: '#fbbf24', cursor: 'pointer' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#fbbf24' }}
                    >
                      <Star size={26} fill={star <= rating ? 'currentColor' : 'none'} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Cảm nhận của bạn về món ăn & dịch vụ:</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={reviewBody}
                  onChange={(e) => setReviewBody(e.target.value)}
                  placeholder="Món ăn ngon, nhân viên nhiệt tình, giữ bàn đúng giờ..."
                  required
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%' }}
                disabled={submittingReview}
              >
                {submittingReview ? 'Đang gửi đánh giá...' : 'Gửi đánh giá'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

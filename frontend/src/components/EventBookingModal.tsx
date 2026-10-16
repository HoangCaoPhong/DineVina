import React, { useState } from 'react'
import {
  PartyPopper,
  Send,
  MessageSquare,
  CheckCircle2
} from 'lucide-react'
import { Venue, EventBooking } from '../types'
import { createEvent, sendEventMessage } from '../api'

interface EventBookingViewProps {
  venues: Venue[]
  events: EventBooking[]
  onRefresh: () => void
}

export const EventBookingView: React.FC<EventBookingViewProps> = ({
  venues,
  events,
  onRefresh
}) => {
  const [selectedVenueId, setSelectedVenueId] = useState(venues[0]?.id || 'v1')
  const [occasion, setOccasion] = useState('Tiệc sinh nhật')
  const [headcount, setHeadcount] = useState(20)
  const [eventDate, setEventDate] = useState('2026-10-25')
  const [eventTime, setEventTime] = useState('18:30')
  const [budgetRange, setBudgetRange] = useState('5.000.000đ - 10.000.000đ')
  const [specialNeeds, setSpecialNeeds] = useState('Cần phòng riêng có máy chiếu và setup backdrop tiệc.')
  const [submitting, setSubmitting] = useState(false)
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({})
  const [successMsg, setSuccessMsg] = useState('')

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccessMsg('')
    try {
      await createEvent({
        venue_id: selectedVenueId,
        customer_name: 'Nguyễn Trung Kiên',
        customer_phone: '0912 345 678',
        occasion,
        headcount,
        event_date: eventDate,
        event_time: eventTime,
        budget_range: budgetRange,
        special_needs: specialNeeds
      })
      setSuccessMsg('Đã gửi yêu cầu tổ chức sự kiện thành công! Nhà hàng sẽ liên hệ và gửi báo giá set menu tiệc.')
      onRefresh()
    } catch (err: any) {
      alert(err.message || 'Lỗi khi gửi yêu cầu sự kiện')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSendMessage = async (eventId: string) => {
    const text = replyText[eventId]
    if (!text || !text.trim()) return

    try {
      await sendEventMessage(eventId, {
        sender_role: 'customer',
        sender_name: 'Nguyễn Trung Kiên',
        body: text.trim()
      })
      setReplyText({ ...replyText, [eventId]: '' })
      onRefresh()
    } catch (err: any) {
      alert('Không thể gửi tin nhắn')
    }
  }

  return (
    <div className="main-content">
      <div className="section-header-row">
        <div>
          <h1 className="section-title">Đặt Tiệc & Sự Kiện Đông Người</h1>
          <p className="section-subtitle">
            Dành cho tiệc sinh nhật, liên hoan công ty, báo hỷ từ 15 đến 200+ khách với phòng riêng và set menu ưu đãi.
          </p>
        </div>
      </div>

      {successMsg && (
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
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Form Create Event */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PartyPopper size={20} color="#ff8a65" />
            Gửi Yêu Cầu Tổ Chức Sự Kiện
          </h2>

          <form onSubmit={handleCreateEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Chọn nhà hàng phù hợp:</label>
              <select
                className="form-control"
                value={selectedVenueId}
                onChange={(e) => setSelectedVenueId(e.target.value)}
              >
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.district}) - Sức chứa: {v.available_seats} khách
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Dịp tiệc / Sự kiện:</label>
                <select
                  className="form-control"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                >
                  <option value="Tiệc sinh nhật">Tiệc sinh nhật</option>
                  <option value="Liên hoan công ty">Liên hoan công ty</option>
                  <option value="Tiệc thôi nôi">Tiệc thôi nôi</option>
                  <option value="Họp mặt bạn bè / Họp lớp">Họp mặt bạn bè / Họp lớp</option>
                  <option value="Tiệc báo hỷ">Tiệc báo hỷ</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Số lượng khách dự kiến:</label>
                <input
                  type="number"
                  className="form-control"
                  value={headcount}
                  onChange={(e) => setHeadcount(parseInt(e.target.value) || 15)}
                  min="10"
                  max="500"
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Ngày tổ chức:</label>
                <input
                  type="date"
                  className="form-control"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Giờ bắt đầu:</label>
                <input
                  type="time"
                  className="form-control"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Ngân sách dự kiến:</label>
              <input
                type="text"
                className="form-control"
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                placeholder="VD: 5.000.000đ - 10.000.000đ"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Yêu cầu đặc biệt & Tiện ích:</label>
              <textarea
                className="form-control"
                rows={3}
                value={specialNeeds}
                onChange={(e) => setSpecialNeeds(e.target.value)}
                placeholder="Cần phòng riêng, trang trí tiệc, máy chiếu, micro karaoke..."
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
              disabled={submitting}
            >
              {submitting ? 'Đang gửi yêu cầu...' : 'Gửi Yêu Cầu Cho Nhà Hàng'}
            </button>
          </form>
        </div>

        {/* Existing Event Threads */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} color="#38bdf8" />
            Trao Đổi & Báo Giá Sự Kiện ({events.length})
          </h2>

          {events.length === 0 ? (
            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              textAlign: 'center',
              color: 'var(--text-tertiary)'
            }}>
              Chưa có cuộc trao đổi sự kiện nào.
            </div>
          ) : (
            events.map((evt) => (
              <div
                key={evt.id}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{evt.venue_name}</h3>
                  <span className="status-pill pending">{evt.status}</span>
                </div>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  {evt.occasion} · {evt.headcount} khách · Ngày {evt.event_date} lúc {evt.event_time}
                </div>

                {/* Messages Box */}
                <div style={{
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  maxHeight: '180px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  {evt.messages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        padding: '0.5rem 0.75rem',
                        borderRadius: 'var(--radius-sm)',
                        background: m.sender_role === 'customer' ? '#fff1f2' : '#f0f9ff',
                        borderLeft: m.sender_role === 'customer' ? '3px solid var(--pasgo-red)' : '3px solid #0284c7',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.75rem', color: m.sender_role === 'customer' ? 'var(--pasgo-red)' : '#0284c7', marginBottom: '2px' }}>
                        {m.sender_name} ({m.sender_role === 'customer' ? 'Khách hàng' : 'Nhà hàng'}):
                      </div>
                      <div style={{ color: '#1e293b' }}>{m.body}</div>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nhập tin nhắn trao đổi thêm với nhà hàng..."
                    value={replyText[evt.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [evt.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage(evt.id)
                    }}
                    style={{ fontSize: '0.82rem' }}
                  />
                  <button
                    className="btn-primary"
                    style={{ padding: '0.6rem 0.9rem' }}
                    onClick={() => handleSendMessage(evt.id)}
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

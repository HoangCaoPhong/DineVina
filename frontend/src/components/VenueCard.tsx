import React from 'react'
import { Star, MapPin, Zap, Utensils, ChevronRight } from 'lucide-react'
import { Venue, TimeSlotDiscount } from '../types'

interface VenueCardProps {
  venue: Venue
  onSelectSlot: (venue: Venue, slot: TimeSlotDiscount) => void
  onOpenBooking: (venue: Venue) => void
  onOpenDetail: (venue: Venue) => void
}

export const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  onSelectSlot,
  onOpenBooking,
  onOpenDetail
}) => {
  return (
    <div className="venue-card">
      {/* Image with badges */}
      <div className="card-image-wrap" onClick={() => onOpenDetail(venue)} style={{ cursor: 'pointer' }}>
        <img src={venue.cover_image} alt={venue.name} className="card-img" />

        {venue.max_discount > 0 && (
          <div className="deal-floating-badge">
            <Zap size={14} fill="currentColor" />
            GIẢM TỚI {venue.max_discount}%
          </div>
        )}

        <div className="cuisine-chip">{venue.cuisine}</div>

        <div className="rating-badge">
          <Star size={13} fill="currentColor" />
          <span>{venue.rating.toFixed(1)}</span>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>({venue.review_count})</span>
        </div>
      </div>

      {/* Body */}
      <div className="card-body">
        <h3
          className="venue-title"
          onClick={() => onOpenDetail(venue)}
          style={{ cursor: 'pointer' }}
          title={venue.name}
        >
          {venue.name}
        </h3>

        <div className="venue-address">
          <MapPin size={13} />
          <span style={{ display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {venue.address}
          </span>
        </div>

        <div className="venue-meta-row">
          <span className="price-text">{venue.price_range}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            Giờ mở: {venue.opening_hours}
          </span>
        </div>

        {/* Eatigo Time-slot discounts */}
        {venue.time_slots && venue.time_slots.length > 0 && (
          <div className="eatigo-slots-preview">
            <div className="eatigo-slots-title">⚡ Chọn giờ ăn hưởng ưu đãi Eatigo:</div>
            <div className="slots-grid">
              {venue.time_slots.slice(0, 4).map((slot, idx) => (
                <button
                  key={idx}
                  className={`slot-btn ${slot.discount_percent === 0 ? 'no-deal' : ''}`}
                  onClick={() => onSelectSlot(venue, slot)}
                  title={`Đặt bàn lúc ${slot.time} - Giảm ${slot.discount_percent}%`}
                >
                  <div className="slot-time">{slot.time}</div>
                  <div className="slot-discount">
                    {slot.discount_percent > 0 ? `-${slot.discount_percent}%` : 'Chuẩn'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="card-actions-row">
          <button className="btn-secondary" onClick={() => onOpenDetail(venue)}>
            <Utensils size={14} />
            Menu & Chi tiết
          </button>
          <button className="btn-primary" onClick={() => onOpenBooking(venue)}>
            Đặt bàn ngay
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  )
}

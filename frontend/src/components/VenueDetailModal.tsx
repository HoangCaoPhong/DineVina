import React, { useState, useEffect } from 'react'
import {
  X,
  Star,
  MapPin,
  Phone,
  Clock
} from 'lucide-react'
import { Venue, MenuCategory, Review } from '../types'
import { fetchVenueMenu, fetchVenueReviews } from '../api'

interface VenueDetailModalProps {
  venue: Venue
  onClose: () => void
  onOpenBooking: (venue: Venue) => void
}

export const VenueDetailModal: React.FC<VenueDetailModalProps> = ({
  venue,
  onClose,
  onOpenBooking
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'menu' | 'reviews'>('info')
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingMenu, setLoadingMenu] = useState(false)
  const [loadingReviews, setLoadingReviews] = useState(false)

  useEffect(() => {
    if (activeTab === 'menu' && menuCategories.length === 0) {
      setLoadingMenu(true)
      fetchVenueMenu(venue.id)
        .then(setMenuCategories)
        .catch(console.error)
        .finally(() => setLoadingMenu(false))
    } else if (activeTab === 'reviews' && reviews.length === 0) {
      setLoadingReviews(true)
      fetchVenueReviews(venue.id)
        .then(setReviews)
        .catch(console.error)
        .finally(() => setLoadingReviews(false))
    }
  }, [activeTab, venue.id])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <h2 className="modal-title">{venue.name}</h2>
            <div className="rating-badge" style={{ position: 'static' }}>
              <Star size={13} fill="currentColor" />
              <span>{venue.rating.toFixed(1)}</span>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          padding: '0 1.5rem'
        }}>
          <button
            onClick={() => setActiveTab('info')}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'info' ? '2.5px solid var(--pasgo-red)' : '2.5px solid transparent',
              color: activeTab === 'info' ? 'var(--pasgo-red)' : '#64748b',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Tổng quan & Hình ảnh
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'menu' ? '2.5px solid var(--pasgo-red)' : '2.5px solid transparent',
              color: activeTab === 'menu' ? 'var(--pasgo-red)' : '#64748b',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Thực đơn món ăn (Menu)
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              padding: '0.85rem 1.25rem',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'reviews' ? '2.5px solid var(--pasgo-red)' : '2.5px solid transparent',
              color: activeTab === 'reviews' ? 'var(--pasgo-red)' : '#64748b',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          >
            Đánh giá thực khách ({venue.review_count})
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body" style={{ maxHeight: '65vh', overflowY: 'auto' }}>
          {activeTab === 'info' && (
            <div>
              {/* Photo gallery */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '0.75rem',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                marginBottom: '1.25rem',
                height: '240px'
              }}>
                <img
                  src={venue.cover_image}
                  alt={venue.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '100%' }}>
                  {(venue.images.slice(1, 3)).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Thumbnail"
                      style={{ width: '100%', height: 'calc(50% - 0.375rem)', objectFit: 'cover' }}
                    />
                  ))}
                </div>
              </div>

              {/* Quick details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem' }}>
                  <MapPin size={16} color="#ff8a65" />
                  <span>{venue.address}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem' }}>
                  <Phone size={16} color="#34d399" />
                  <span>{venue.contact_phone || '1900 8989'}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem' }}>
                  <Clock size={16} color="#fbbf24" />
                  <span>{venue.opening_hours}</span>
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Giới thiệu nhà hàng</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {venue.full_description || venue.description}
                </p>
              </div>

              {/* Amenities */}
              <div style={{ marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.6rem' }}>Tiện ích nổi bật</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {venue.amenities.map((am, i) => (
                    <span
                      key={i}
                      style={{
                        padding: '0.35rem 0.75rem',
                        background: 'var(--bg-surface-elevated)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      ✓ {am}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div>
              {loadingMenu ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  Đang tải thực đơn nhà hàng...
                </div>
              ) : menuCategories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                  Nhà hàng đang cập nhật thực đơn chi tiết.
                </div>
              ) : (
                menuCategories.map((cat) => (
                  <div key={cat.id} style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: 'var(--pasgo-red)',
                      marginBottom: '0.75rem',
                      borderBottom: '2px solid #e2e8f0',
                      paddingBottom: '0.4rem'
                    }}>
                      {cat.name}
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.9rem' }}>
                      {cat.dishes.map((dish) => (
                        <div
                          key={dish.id}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.75rem',
                            display: 'flex',
                            gap: '0.75rem',
                            boxShadow: 'var(--shadow-xs)'
                          }}
                        >
                          <img
                            src={dish.image_url}
                            alt={dish.name}
                            style={{ width: '70px', height: '70px', borderRadius: 'var(--radius-xs)', objectFit: 'cover' }}
                          />
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>{dish.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 6px' }}>
                              {dish.description}
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ color: 'var(--pasgo-red)', fontWeight: 800, fontSize: '0.85rem' }}>
                                {dish.price_vnd.toLocaleString('vi-VN')} đ
                              </span>
                              {dish.dietary_tags.length > 0 && (
                                <span style={{
                                  fontSize: '0.68rem',
                                  background: 'var(--pasgo-red-light)',
                                  color: 'var(--pasgo-red)',
                                  padding: '1px 6px',
                                  borderRadius: '4px',
                                  fontWeight: 700
                                }}>
                                  {dish.dietary_tags[0]}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {loadingReviews ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  Đang tải đánh giá từ thực khách...
                </div>
              ) : reviews.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                  Chưa có đánh giá nào cho nhà hàng này.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: 'var(--radius-sm)',
                        padding: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1e293b' }}>{rev.customer_name}</div>
                        <div style={{ display: 'flex', color: '#d97706', gap: '2px' }}>
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} size={13} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p style={{ color: '#475569', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                        {rev.body}
                      </p>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{rev.created_at}</div>

                      {rev.partner_reply && (
                        <div style={{
                          marginTop: '0.75rem',
                          padding: '0.6rem 0.8rem',
                          background: '#fff1f2',
                          borderLeft: '3px solid var(--pasgo-red)',
                          borderRadius: '4px',
                          fontSize: '0.8rem'
                        }}>
                          <div style={{ fontWeight: 800, color: 'var(--pasgo-red)', marginBottom: '2px' }}>Phản hồi từ Nhà hàng:</div>
                          <div style={{ color: '#475569' }}>{rev.partner_reply}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#ffffff'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Mức giá tham khảo</div>
            <div style={{ color: 'var(--pasgo-red)', fontWeight: 800, fontSize: '1rem' }}>{venue.price_range} / người</div>
          </div>
          <button
            className="btn-primary"
            style={{ padding: '0.75rem 1.75rem' }}
            onClick={() => {
              onClose()
              onOpenBooking(venue)
            }}
          >
            Đặt chỗ ngay (Nhận ưu đãi)
          </button>
        </div>
      </div>
    </div>
  )
}

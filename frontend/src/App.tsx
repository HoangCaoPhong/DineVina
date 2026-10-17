import { useState, useEffect } from 'react'
import {
  Venue,
  Reservation,
  EventBooking,
  NotificationItem,
  TimeSlotDiscount,
  User
} from './types'
import {
  fetchVenues,
  fetchReservations,
  fetchEvents,
  fetchNotifications,
  markNotificationRead,
  fetchMe,
  logoutUser
} from './api'
import { Navbar } from './components/Navbar'
import { HeroSection } from './components/HeroSection'
import { VenueCard } from './components/VenueCard'
import { BookingModal } from './components/BookingModal'
import { VenueDetailModal } from './components/VenueDetailModal'
import { MyBookingsView } from './components/MyBookingsView'
import { EventBookingView } from './components/EventBookingModal'
import { PartnerDashboardView } from './components/PartnerDashboardView'
import { AdminPortalView } from './components/AdminPortalView'
import { LoginModal } from './components/LoginModal'

export function App() {
  const [currentTab, setCurrentTab] = useState<'discovery' | 'bookings' | 'events' | 'partner' | 'admin'>('discovery')
  const [currentRole, setCurrentRole] = useState<'customer' | 'partner' | 'admin'>('customer')
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const [venues, setVenues] = useState<Venue[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [events, setEvents] = useState<EventBooking[]>([])
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('all')
  const [selectedCuisine, setSelectedCuisine] = useState('all')
  const [activeQuickTag, setActiveQuickTag] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  // Modals
  const [bookingVenue, setBookingVenue] = useState<Venue | null>(null)
  const [bookingSlot, setBookingSlot] = useState<TimeSlotDiscount | null>(null)
  const [detailVenue, setDetailVenue] = useState<Venue | null>(null)

  // Load initial data
  const loadAllData = async () => {
    try {
      const [vData, rData, eData, nData, userData] = await Promise.all([
        fetchVenues(),
        fetchReservations(),
        fetchEvents(),
        fetchNotifications(),
        fetchMe()
      ])
      setVenues(vData)
      setReservations(rData)
      setEvents(eData)
      setNotifications(nData)
      if (userData) {
        setCurrentUser(userData)
        setCurrentRole(userData.role as any)
      }
    } catch (err) {
      console.error('Error loading initial data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAllData()
  }, [])

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch (err) {
      console.error('Error logging out:', err)
    } finally {
      setCurrentUser(null)
      setCurrentRole('customer')
      if (currentTab === 'partner' || currentTab === 'admin') {
        setCurrentTab('discovery')
      }
    }
  }

  // Execute Search / Filter query
  const handleSearch = async () => {
    setLoading(true)
    try {
      let hasDeal = false
      let amenity = 'all'

      if (activeQuickTag === 'deal_50') hasDeal = true
      if (activeQuickTag === 'private_room') amenity = 'Phòng riêng'
      if (activeQuickTag === 'parking') amenity = 'Chỗ đỗ ô tô'

      const data = await fetchVenues({
        q: searchQuery,
        district: selectedDistrict,
        cuisine: selectedCuisine,
        has_deal: hasDeal,
        amenity: amenity,
        sort: sortBy
      })
      setVenues(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Trigger search on filter changes
  useEffect(() => {
    handleSearch()
  }, [selectedDistrict, selectedCuisine, activeQuickTag, sortBy])

  const handleSelectSlot = (venue: Venue, slot: TimeSlotDiscount) => {
    setBookingVenue(venue)
    setBookingSlot(slot)
  }

  const handleOpenBooking = (venue: Venue) => {
    setBookingVenue(venue)
    setBookingSlot(null)
  }

  const handleMarkNotificationRead = async (id: string) => {
    await markNotificationRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  return (
    <div className="app-wrapper">
      {/* Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(t: any) => setCurrentTab(t)}
        currentUser={currentUser}
        currentRole={currentRole}
        onOpenLogin={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        myReservationsCount={reservations.length}
      />

      {/* Main Tab Content */}
      {currentTab === 'discovery' && (
        <main>
          <HeroSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            selectedCuisine={selectedCuisine}
            setSelectedCuisine={setSelectedCuisine}
            activeQuickTag={activeQuickTag}
            setActiveQuickTag={setActiveQuickTag}
            onSearch={handleSearch}
          />

          <div className="main-content">
            <div className="section-header-row">
              <div className="section-title-wrap">
                <h2 className="section-title">
                  Khung Giờ Ưu Đãi & Nhà Hàng Nổi Bật ({venues.length})
                </h2>
                <p className="section-subtitle">
                  Đặt chỗ giữ bàn trực tuyến qua DineVina · Áp dụng chiết khấu trực tiếp theo khung giờ
                </p>
              </div>

              {/* Sort selector */}
              <div>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Nổi bật nhất</option>
                  <option value="discount">Ưu đãi giảm sâu nhất (%)</option>
                  <option value="rating">Đánh giá sao cao nhất</option>
                  <option value="reviews">Nhiều lượt đánh giá</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                Đang tìm kiếm nhà hàng phù hợp...
              </div>
            ) : venues.length === 0 ? (
              <div style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-lg)',
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--text-secondary)'
              }}>
                <h3>Không tìm thấy nhà hàng phù hợp với bộ lọc</h3>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  Bạn có thể thử nới lỏng các điều kiện lọc quận hoặc loại ẩm thực.
                </p>
              </div>
            ) : (
              <div className="venues-grid">
                {venues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    onSelectSlot={handleSelectSlot}
                    onOpenBooking={handleOpenBooking}
                    onOpenDetail={(v) => setDetailVenue(v)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      )}

      {currentTab === 'bookings' && (
        <MyBookingsView
          reservations={reservations}
          onRefresh={loadAllData}
        />
      )}

      {currentTab === 'events' && (
        <EventBookingView
          venues={venues}
          events={events}
          onRefresh={loadAllData}
        />
      )}

      {currentTab === 'partner' && (
        <PartnerDashboardView
          reservations={reservations}
          venues={venues}
          onRefresh={loadAllData}
        />
      )}

      {currentTab === 'admin' && (
        <AdminPortalView onRefreshAll={loadAllData} />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-inner">
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
              DineVina – Smart Restaurant Reservation System
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.82rem' }}>
            <span>🍽️ Khám phá</span>
            <span>⚡ Khung giờ ưu đãi</span>
            <span>🛡️ Chính sách hủy bàn Cutoff</span>
            <span>🏪 Quản lý đối tác</span>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {bookingVenue && (
        <BookingModal
          venue={bookingVenue}
          initialSlot={bookingSlot}
          onClose={() => {
            setBookingVenue(null)
            setBookingSlot(null)
          }}
          onSuccess={() => {
            loadAllData()
          }}
        />
      )}

      {/* Venue Detail Modal (Menus & Reviews) */}
      {detailVenue && (
        <VenueDetailModal
          venue={detailVenue}
          onClose={() => setDetailVenue(null)}
          onOpenBooking={(v) => handleOpenBooking(v)}
        />
      )}

      {/* Login / Auth Modal (Group 1 Demo) */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user)
            setCurrentRole(user.role as any)
            if (user.role === 'partner') {
              setCurrentTab('partner')
            } else if (user.role === 'admin') {
              setCurrentTab('admin')
            }
          }}
        />
      )}
    </div>
  )
}

export default App

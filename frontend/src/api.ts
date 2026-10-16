import {
  User,
  Venue,
  MenuCategory,
  Reservation,
  EventBooking,
  Review,
  NotificationItem
} from './types'

const API_BASE = '/api'

export async function fetchMe(): Promise<User | null> {
  const res = await fetch(`${API_BASE}/me`)
  if (!res.ok) return null
  return res.json()
}

export async function loginUser(data: { email?: string; password?: string; role?: string }): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Đăng nhập thất bại')
  }
  const result = await res.json()
  return result.user
}

export async function logoutUser(): Promise<void> {
  await fetch(`${API_BASE}/auth/logout`, { method: 'POST' })
}

export async function registerUser(data: { email: string; password: string; full_name: string; phone: string; role?: string }): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Đăng ký thất bại')
  }
  const result = await res.json()
  return result.user
}

export async function fetchVenues(params?: {
  q?: string
  district?: string
  cuisine?: string
  has_deal?: boolean
  amenity?: string
  sort?: string
}): Promise<Venue[]> {
  const query = new URLSearchParams()
  if (params?.q) query.append('q', params.q)
  if (params?.district && params.district !== 'all') query.append('district', params.district)
  if (params?.cuisine && params.cuisine !== 'all') query.append('cuisine', params.cuisine)
  if (params?.has_deal) query.append('has_deal', 'true')
  if (params?.amenity && params.amenity !== 'all') query.append('amenity', params.amenity)
  if (params?.sort) query.append('sort', params.sort)

  const res = await fetch(`${API_BASE}/venues?${query.toString()}`)
  if (!res.ok) throw new Error('Không thể tải danh sách nhà hàng')
  return res.json()
}

export async function fetchVenueDetail(id: string): Promise<Venue> {
  const res = await fetch(`${API_BASE}/venues/${id}`)
  if (!res.ok) throw new Error('Không thể tải thông tin nhà hàng')
  return res.json()
}

export async function fetchVenueMenu(id: string): Promise<MenuCategory[]> {
  const res = await fetch(`${API_BASE}/venues/${id}/menu`)
  if (!res.ok) throw new Error('Không thể tải thực đơn')
  return res.json()
}

export async function fetchVenueReviews(id: string): Promise<Review[]> {
  const res = await fetch(`${API_BASE}/venues/${id}/reviews`)
  if (!res.ok) throw new Error('Không thể tải đánh giá')
  return res.json()
}

export async function createReservation(data: {
  venue_id: string
  customer_name: string
  customer_phone: string
  reserved_date: string
  reserved_time: string
  party_size: number
  discount_percent: number
  note?: string
}): Promise<Reservation> {
  const res = await fetch(`${API_BASE}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Không thể tạo đơn đặt bàn')
  }
  return res.json()
}

export async function fetchReservations(): Promise<Reservation[]> {
  const res = await fetch(`${API_BASE}/reservations`)
  if (!res.ok) throw new Error('Không thể tải danh sách đặt bàn')
  return res.json()
}

export async function cancelReservation(id: string, reason: string): Promise<Reservation> {
  const res = await fetch(`${API_BASE}/reservations/${id}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Không thể hủy đặt bàn')
  }
  return res.json()
}

export async function partnerConfirmReservation(id: string): Promise<Reservation> {
  const res = await fetch(`${API_BASE}/partner/reservations/${id}/confirm`, {
    method: 'POST',
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Không thể xác nhận đặt bàn')
  }
  return res.json()
}

export async function partnerRejectReservation(id: string, reason: string): Promise<Reservation> {
  const res = await fetch(`${API_BASE}/partner/reservations/${id}/reject`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Không thể từ chối đặt bàn')
  }
  return res.json()
}

export async function fetchPartnerDashboard(): Promise<any> {
  const res = await fetch(`${API_BASE}/partner/dashboard`)
  if (!res.ok) throw new Error('Không thể tải dữ liệu dashboard')
  return res.json()
}

export async function fetchEvents(): Promise<EventBooking[]> {
  const res = await fetch(`${API_BASE}/events`)
  if (!res.ok) throw new Error('Không thể tải danh sách sự kiện')
  return res.json()
}

export async function createEvent(data: {
  venue_id: string
  customer_name: string
  customer_phone: string
  occasion: string
  headcount: number
  event_date: string
  event_time: string
  budget_range: string
  special_needs: string
}): Promise<EventBooking> {
  const res = await fetch(`${API_BASE}/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Không thể gửi yêu cầu sự kiện')
  }
  return res.json()
}

export async function sendEventMessage(
  eventId: string,
  message: { sender_role: string; sender_name: string; body: string }
): Promise<EventBooking> {
  const res = await fetch(`${API_BASE}/events/${eventId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  })
  if (!res.ok) throw new Error('Không thể gửi tin nhắn')
  return res.json()
}

export async function submitReview(
  reservationId: string,
  rating: number,
  body: string
): Promise<Review> {
  const res = await fetch(`${API_BASE}/reservations/${reservationId}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ reservation_id: reservationId, rating, body }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Không thể gửi đánh giá')
  }
  return res.json()
}

export async function fetchNotifications(): Promise<NotificationItem[]> {
  const res = await fetch(`${API_BASE}/me/notifications`)
  if (!res.ok) throw new Error('Không thể tải thông báo')
  return res.json()
}

export async function markNotificationRead(id: string): Promise<void> {
  await fetch(`${API_BASE}/me/notifications/${id}/read`, { method: 'PATCH' })
}

export async function askAI(query: string): Promise<{
  query: string
  explanation: string
  suggestions: Venue[]
}> {
  const res = await fetch(`${API_BASE}/ai/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })
  if (!res.ok) throw new Error('Lỗi AI hỗ trợ')
  return res.json()
}

export async function partnerSubmitVenue(data: any): Promise<any> {
  const res = await fetch(`${API_BASE}/partner/venues`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Không thể đăng ký nhà hàng')
  return res.json()
}

export async function adminListVenues(status?: string): Promise<any[]> {
  const url = status ? `${API_BASE}/admin/venues?status_filter=${status}` : `${API_BASE}/admin/venues`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Không thể tải danh sách duyệt')
  return res.json()
}

export async function adminApproveVenue(id: string): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/venues/${id}/approve`, { method: 'POST' })
  if (!res.ok) throw new Error('Lỗi khi duyệt nhà hàng')
  return res.json()
}

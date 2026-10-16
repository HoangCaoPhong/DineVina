export interface User {
  id: string
  email: string
  full_name: string
  phone: string
  role: 'customer' | 'partner' | 'admin'
  avatar_url?: string
  role_label?: string
}

export interface TimeSlotDiscount {
  time: string
  discount_percent: number
  remaining_tables: number
}

export interface DishItem {
  id: string
  category_id: string
  name: string
  description: string
  price_vnd: number
  image_url: string
  dietary_tags: string[]
  available: boolean
  is_special?: boolean
}

export interface MenuCategory {
  id: string
  venue_id: string
  name: string
  position: number
  dishes: DishItem[]
}

export interface Venue {
  id: string
  name: string
  slug: string
  address: string
  district: string
  city: string
  cuisine: string
  price_range: string
  rating: number
  review_count: number
  cover_image: string
  images: string[]
  amenities: string[]
  status: string
  max_discount: number
  deal_label?: string
  opening_hours: string
  description: string
  full_description?: string
  contact_phone?: string
  cancellation_cutoff_hours: number
  available_seats: number
  time_slots: TimeSlotDiscount[]
}

export interface StatusHistoryEntry {
  from_status: string
  to_status: string
  actor_id: string
  actor_name: string
  reason?: string
  changed_at: string
}

export interface Reservation {
  id: string
  confirmation_code: string
  venue_id: string
  venue_name: string
  venue_address: string
  venue_image: string
  customer_id: string
  customer_name: string
  customer_phone: string
  reserved_date: string
  reserved_time: string
  party_size: number
  discount_percent: number
  note?: string
  status: 'Pending' | 'Confirmed' | 'Rejected' | 'Cancelled' | 'Completed' | 'Expired'
  created_at: string
  cancellation_cutoff_hours: number
  can_cancel: boolean
  reject_reason?: string
  status_history: StatusHistoryEntry[]
}

export interface EventMessage {
  id: string
  sender_role: 'customer' | 'partner'
  sender_name: string
  body: string
  created_at: string
}

export interface EventBooking {
  id: string
  venue_id: string
  venue_name: string
  customer_id: string
  customer_name: string
  customer_phone: string
  occasion: string
  headcount: number
  event_date: string
  event_time: string
  budget_range: string
  special_needs: string
  status: string
  messages: EventMessage[]
  created_at: string
}

export interface Review {
  id: string
  reservation_id: string
  venue_id: string
  customer_name: string
  rating: number
  body: string
  created_at: string
  partner_reply?: string
}

export interface NotificationItem {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  read: boolean
  created_at: string
  link?: string
}

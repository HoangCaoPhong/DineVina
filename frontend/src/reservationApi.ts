export type BookingLocation = {
  id: string
  name: string
  area: string
  address: string
  image: string
  hours: string
  maxCapacity?: number
}

export type AvailabilitySlot = {
  time: string
  status: string
  is_blocked: boolean
}

export type Reservation = {
  id: string
  reservation_code: string
  venue_name: string
  venue_hotline: string
  reserved_date: string
  reserved_time: string
  party_size: number
  special_requests: string
  status: string
  response_deadline: string
  cancellation_deadline: string
  status_history: {
    id: string
    to_state: string
    actor_role: string
    reason: string
    created_at: string
  }[]
}

type ReservationPage = {
  items: Reservation[]
  total: number
  page: number
  page_size: number
}

export type ReservationRequest = {
  venue_id: string
  reserved_date: string
  reserved_time: string
  party_size: number
  customer_name: string
  customer_phone: string
  special_requests: string
}

type ErrorDetail = {
  code?: string
  suggested_slots?: string[]
  venue_hotline?: string
}

export class ReservationApiError extends Error {
  constructor(readonly status: number, readonly detail: ErrorDetail = {}) {
    super('Reservation API request failed')
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const abort = () => controller.abort()
  const callerSignal = options?.signal
  if (callerSignal?.aborted) abort()
  else callerSignal?.addEventListener('abort', abort, { once: true })

  const timeout = window.setTimeout(abort, 20_000)
  try {
    const response = await fetch(path, { ...options, signal: controller.signal })
    if (!response.ok) {
      const body: { detail?: unknown } | null = await response.json().catch(() => null)
      const detail = body?.detail
      throw new ReservationApiError(
        response.status,
        detail && typeof detail === 'object' && !Array.isArray(detail) ? detail as ErrorDetail : {},
      )
    }
    return await response.json() as T
  } finally {
    window.clearTimeout(timeout)
    callerSignal?.removeEventListener('abort', abort)
  }
}

function customerHeaders(customerId: string) {
  // Kiên's PA4 backend resolves the demo actor from these development headers.
  return { 'X-User-Id': customerId, 'X-User-Role': 'customer' }
}

export async function loadAvailability(venueId: string, date: string, partySize: number, signal: AbortSignal) {
  const params = new URLSearchParams({ date, party_size: String(partySize) })
  const result = await request<{ slots: AvailabilitySlot[] }>(
    `/api/venues/${encodeURIComponent(venueId)}/availability?${params}`,
    { signal, cache: 'no-store' },
  )
  return result.slots
}

export function submitReservation(customerId: string, data: ReservationRequest, key: string) {
  return request<Reservation>('/api/reservations', {
    method: 'POST',
    headers: { ...customerHeaders(customerId), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, idempotency_key: key }),
  })
}

export function listReservations(customerId: string, page: number, signal: AbortSignal) {
  return request<ReservationPage>(`/api/reservations?page=${page}`, {
    headers: customerHeaders(customerId), signal, cache: 'no-store',
  })
}

export function getReservation(customerId: string, id: string, signal?: AbortSignal) {
  return request<Reservation>(`/api/reservations/${encodeURIComponent(id)}`, {
    headers: customerHeaders(customerId), signal, cache: 'no-store',
  })
}

export function cancelReservation(customerId: string, id: string, reason: string) {
  return request<Reservation>(`/api/reservations/${encodeURIComponent(id)}/cancel`, {
    method: 'POST',
    headers: { ...customerHeaders(customerId), 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason }),
  })
}

export function reservationKey() {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

const demoIds = new Map<string, string>()

export function demoCustomerId(email: string) {
  const key = `dinevina:demo-customer:${email.trim().toLowerCase()}`
  let id = demoIds.get(key)
  if (id) return id
  try {
    id = localStorage.getItem(key) ?? `demo-customer-${reservationKey()}`
    localStorage.setItem(key, id)
  } catch {
    id ??= `demo-customer-${reservationKey()}`
  }
  demoIds.set(key, id)
  return id
}

const timeZone = 'Asia/Ho_Chi_Minh'
const dateInputFormat = new Intl.DateTimeFormat('sv-SE', { timeZone, dateStyle: 'short' })
const deadlineFormat = new Intl.DateTimeFormat('vi-VN', { timeZone, dateStyle: 'short', timeStyle: 'short' })

export function todayInVietnam() {
  return dateInputFormat.format(new Date())
}

export function bookingDateLabel(date: string) {
  return date.split('-').reverse().join('/')
}

export function deadlineLabel(timestamp: string) {
  return deadlineFormat.format(new Date(timestamp))
}

const statusLabels: Record<string, string> = {
  'Pending confirmation': 'Chờ xác nhận',
  Confirmed: 'Đã xác nhận',
  Declined: 'Đã từ chối',
  Expired: 'Hết hạn xác nhận',
  'Cancelled by customer': 'Khách đã hủy',
  'Cancelled by restaurant': 'Nhà hàng đã hủy',
  Completed: 'Hoàn tất',
  'No-show': 'Khách không đến',
}

export function statusLabel(status: string) {
  return statusLabels[status] ?? status
}

export function reservationError(error: unknown, fallback: string) {
  if (!(error instanceof ReservationApiError)) return fallback
  if (error.status === 401) return 'Phiên thực khách không hợp lệ. Hãy đăng nhập lại.'
  if (error.status === 403 || error.detail.code === 'RESERVATION_NOT_FOUND') return 'Bạn không thể mở yêu cầu đặt bàn này.'
  if (error.detail.code === 'VENUE_NOT_FOUND') return 'Nhà hàng hiện không nhận yêu cầu qua DineVina.'
  if (error.status === 404) return 'Dịch vụ đặt bàn chưa khả dụng.'
  switch (error.detail.code) {
    case 'PARTY_SIZE_OUT_OF_RANGE':
    case 'PARTY_SIZE_EXCEEDS_CAPACITY':
      return 'Số khách vượt quá giới hạn cho phép của nhà hàng.'
    case 'PAST_DATE':
    case 'PAST_DATETIME':
      return 'Vui lòng chọn ngày và giờ chưa qua.'
    case 'INVALID_DATE':
    case 'INVALID_DATETIME':
    case 'INVALID_SLOT':
      return 'Khung giờ không còn hợp lệ. Hãy kiểm tra lại các giờ còn chỗ.'
    case 'SLOT_FULL':
      return 'Khung giờ vừa chọn đã hết chỗ cho nhóm của bạn.'
    case 'CANCELLATION_CUTOFF_PASSED':
      return 'Đã qua hạn hủy trực tuyến. Bạn có thể liên hệ trực tiếp với nhà hàng.'
    case 'INVALID_STATE_TRANSITION':
      return 'Trạng thái đã thay đổi. Yêu cầu hủy không được áp dụng.'
    default:
      return error.status === 422 ? 'Vui lòng kiểm tra lại các thông tin đã nhập.' : fallback
  }
}

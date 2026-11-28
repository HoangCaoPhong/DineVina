export type StaffRole = 'customer' | 'partner_staff' | 'administrator'

export type StaffVenueOption = {
  id: string
  name: string
}

export type ReservationHistoryEntry = {
  id: string
  from_state: string | null
  to_state: string
  actor_id: string
  actor_role: string
  reason: string
  created_at: string
}

export type StaffReservation = {
  id: string
  reservation_code: string
  venue_id: string
  venue_name: string
  venue_hotline: string
  customer_id: string
  customer_name: string
  customer_phone: string
  reserved_date: string
  reserved_time: string
  party_size: number
  special_requests: string
  status: string
  response_deadline: string
  cancellation_deadline: string
  created_at: string
  updated_at: string
  status_history: ReservationHistoryEntry[]
}

export type StaffReservationPage = {
  total: number
  page: number
  page_size: number
  items: StaffReservation[]
}

export type PartnerActor = {
  userId: string
  venueIds: string[]
}

export type AdminActor = {
  userId: string
}

export type StaffApiErrorDetail = {
  code?: string
  message?: string
  request_id?: string
}

export class StaffApiError extends Error {
  readonly status: number
  readonly detail: StaffApiErrorDetail

  constructor(status: number, detail: StaffApiErrorDetail = {}) {
    super(detail.message || `API request failed with status ${status}`)
    this.name = 'StaffApiError'
    this.status = status
    this.detail = detail
  }
}

export type RbacProbeResult = {
  endpoint: string
  roleSent: string
  status: number
  code: string
  message: string
  blocked: boolean
}

export const ALL_RESERVATION_STATUSES = [
  'Pending confirmation',
  'Confirmed',
  'Declined',
  'Expired',
  'Cancelled by customer',
  'Cancelled by restaurant',
  'Completed',
  'No-show',
] as const

export const FALLBACK_DEMO_VENUES: StaffVenueOption[] = [
  { id: 'v-hcmc-001', name: 'Nhà hàng mẫu v-hcmc-001' },
  { id: 'v-hcmc-002', name: 'Nhà hàng mẫu v-hcmc-002' },
  { id: 'v-hcmc-003', name: 'Nhà hàng mẫu v-hcmc-003' },
]

async function staffRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController()
  const callerSignal = options?.signal
  const abort = () => controller.abort()

  if (callerSignal?.aborted) abort()
  else callerSignal?.addEventListener('abort', abort, { once: true })

  const timeoutId = window.setTimeout(abort, 15_000)
  try {
    const response = await fetch(path, { ...options, signal: controller.signal })
    if (!response.ok) {
      const body: { detail?: unknown } | null = await response.json().catch(() => null)
      const rawDetail = body?.detail
      const parsed: StaffApiErrorDetail =
        rawDetail && typeof rawDetail === 'object' && !Array.isArray(rawDetail)
          ? (rawDetail as StaffApiErrorDetail)
          : {
              message:
                typeof rawDetail === 'string'
                  ? rawDetail
                  : Array.isArray(rawDetail)
                    ? 'Dữ liệu gửi lên chưa hợp lệ.'
                    : undefined,
            }
      throw new StaffApiError(response.status, parsed)
    }
    return (await response.json()) as T
  } finally {
    window.clearTimeout(timeoutId)
    callerSignal?.removeEventListener('abort', abort)
  }
}

function partnerHeaders(actor: PartnerActor): Record<string, string> {
  const headers: Record<string, string> = {
    'X-User-Id': actor.userId.trim() || 'partner-001',
    'X-User-Role': 'partner_staff',
  }
  if (actor.venueIds.length > 0) {
    headers['X-Partner-Venues'] = actor.venueIds.join(',')
  }
  return headers
}

function adminHeaders(actor: AdminActor): Record<string, string> {
  return {
    'X-User-Id': actor.userId.trim() || 'admin-001',
    'X-User-Role': 'administrator',
  }
}

export function listPartnerReservations(
  actor: PartnerActor,
  params: {
    venueId?: string
    status?: string
    reservedDate?: string
    page?: number
    pageSize?: number
  },
  signal?: AbortSignal,
): Promise<StaffReservationPage> {
  const qs = new URLSearchParams()
  if (params.venueId) qs.set('venue_id', params.venueId)
  if (params.status) qs.set('status', params.status)
  if (params.reservedDate) qs.set('reserved_date', params.reservedDate)
  qs.set('page', String(params.page ?? 1))
  qs.set('page_size', String(params.pageSize ?? 15))

  return staffRequest<StaffReservationPage>(`/api/partner/reservations?${qs.toString()}`, {
    headers: partnerHeaders(actor),
    signal,
    cache: 'no-store',
  })
}

export function confirmPartnerReservation(
  actor: PartnerActor,
  reservationId: string,
): Promise<StaffReservation> {
  return staffRequest<StaffReservation>(
    `/api/partner/reservations/${encodeURIComponent(reservationId)}/confirm`,
    { method: 'POST', headers: partnerHeaders(actor) },
  )
}

export function declinePartnerReservation(
  actor: PartnerActor,
  reservationId: string,
  reason: string,
): Promise<StaffReservation> {
  return staffRequest<StaffReservation>(
    `/api/partner/reservations/${encodeURIComponent(reservationId)}/decline`,
    {
      method: 'POST',
      headers: { ...partnerHeaders(actor), 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    },
  )
}

export function cancelPartnerReservation(
  actor: PartnerActor,
  reservationId: string,
  reason: string,
): Promise<StaffReservation> {
  return staffRequest<StaffReservation>(
    `/api/partner/reservations/${encodeURIComponent(reservationId)}/cancel`,
    {
      method: 'POST',
      headers: { ...partnerHeaders(actor), 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    },
  )
}

export function checkInPartnerReservation(
  actor: PartnerActor,
  reservationId: string,
): Promise<StaffReservation> {
  return staffRequest<StaffReservation>(
    `/api/partner/reservations/${encodeURIComponent(reservationId)}/check-in`,
    { method: 'POST', headers: partnerHeaders(actor) },
  )
}

export function markPartnerNoShow(
  actor: PartnerActor,
  reservationId: string,
  reason: string,
): Promise<StaffReservation> {
  return staffRequest<StaffReservation>(
    `/api/partner/reservations/${encodeURIComponent(reservationId)}/no-show`,
    {
      method: 'POST',
      headers: { ...partnerHeaders(actor), 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    },
  )
}

export function searchAdminReservations(
  actor: AdminActor,
  params: {
    q?: string
    venueId?: string
    status?: string
    page?: number
    pageSize?: number
  },
  signal?: AbortSignal,
): Promise<StaffReservationPage> {
  const qs = new URLSearchParams()
  if (params.q?.trim()) qs.set('q', params.q.trim())
  if (params.venueId) qs.set('venue_id', params.venueId)
  if (params.status) qs.set('status', params.status)
  qs.set('page', String(params.page ?? 1))
  qs.set('page_size', String(params.pageSize ?? 15))

  return staffRequest<StaffReservationPage>(
    `/api/admin/reservations/support?${qs.toString()}`,
    {
      headers: adminHeaders(actor),
      signal,
      cache: 'no-store',
    },
  )
}

export function getAdminReservationDetail(
  actor: AdminActor,
  reservationId: string,
  signal?: AbortSignal,
): Promise<StaffReservation> {
  return staffRequest<StaffReservation>(
    `/api/admin/reservations/${encodeURIComponent(reservationId)}`,
    {
      headers: adminHeaders(actor),
      signal,
      cache: 'no-store',
    },
  )
}

export async function probeRbacAccess(options: {
  endpoint: string
  role: StaffRole | null
  userId?: string
  partnerVenues?: string[]
}): Promise<RbacProbeResult> {
  const headers: Record<string, string> = {}
  if (options.role && options.userId) {
    headers['X-User-Id'] = options.userId
    headers['X-User-Role'] = options.role
    if (options.partnerVenues && options.partnerVenues.length > 0) {
      headers['X-Partner-Venues'] = options.partnerVenues.join(',')
    }
  }

  try {
    const response = await fetch(options.endpoint, { headers, cache: 'no-store' })
    const body: { detail?: StaffApiErrorDetail } | null = await response
      .json()
      .catch(() => null)
    const code = body?.detail?.code || (response.ok ? 'ALLOWED' : `HTTP_${response.status}`)
    const message =
      body?.detail?.message ||
      (response.ok
        ? 'API cho phép truy cập (200 OK).'
        : `Backend từ chối truy cập với mã HTTP ${response.status}.`)
    return {
      endpoint: options.endpoint,
      roleSent: options.role ?? 'anonymous (no headers)',
      status: response.status,
      code,
      message,
      blocked: response.status === 401 || response.status === 403,
    }
  } catch {
    return {
      endpoint: options.endpoint,
      roleSent: options.role ?? 'anonymous',
      status: 0,
      code: 'NETWORK_ERROR',
      message: 'Không kết nối được tới API backend F5.',
      blocked: false,
    }
  }
}

const vnDateTimeFormatter = new Intl.DateTimeFormat('vi-VN', {
  timeZone: 'Asia/Ho_Chi_Minh',
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatBookingDate(isoDate: string): string {
  const parts = isoDate.split('-')
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : isoDate
}

export function formatVnTimestamp(isoTimestamp: string): string {
  const parsed = Date.parse(isoTimestamp)
  if (Number.isNaN(parsed)) return isoTimestamp
  return vnDateTimeFormatter.format(new Date(parsed))
}

export function getStatusMeta(status: string): { label: string; tone: string } {
  switch (status) {
    case 'Pending confirmation':
      return { label: 'Chờ xác nhận', tone: 'pending' }
    case 'Confirmed':
      return { label: 'Đã xác nhận', tone: 'confirmed' }
    case 'Declined':
      return { label: 'Đã từ chối', tone: 'declined' }
    case 'Expired':
      return { label: 'Hết hạn 30p', tone: 'muted' }
    case 'Cancelled by customer':
      return { label: 'Khách đã hủy', tone: 'cancelled' }
    case 'Cancelled by restaurant':
      return { label: 'Nhà hàng hủy', tone: 'cancelled' }
    case 'Completed':
      return { label: 'Hoàn tất (Check-in)', tone: 'completed' }
    case 'No-show':
      return { label: 'Không đến (No-show)', tone: 'declined' }
    default:
      return { label: status, tone: 'muted' }
  }
}

export function getActorRoleLabel(role: string): string {
  switch (role) {
    case 'customer':
      return 'Thực khách'
    case 'partner_staff':
      return 'Nhân viên nhà hàng'
    case 'administrator':
      return 'Quản trị viên'
    case 'system':
      return 'Hệ thống tự động'
    default:
      return role
  }
}

export function formatStaffApiError(error: unknown, fallback: string): string {
  if (!(error instanceof StaffApiError)) return fallback
  const code = error.detail.code
  switch (code) {
    case 'AUTH_REQUIRED':
      return 'Thiếu thông tin xác thực (401 AUTH_REQUIRED).'
    case 'INVALID_ROLE':
    case 'FORBIDDEN_ROLE':
      return 'Tài khoản không có quyền thực hiện thao tác này (403 FORBIDDEN_ROLE).'
    case 'FORBIDDEN_VENUE':
      return 'Nhân viên đối tác không có quyền quản lý nhà hàng này (403 FORBIDDEN_VENUE).'
    case 'RESERVATION_NOT_FOUND':
      return 'Không tìm thấy đơn đặt bàn (404 RESERVATION_NOT_FOUND).'
    case 'RESERVATION_EXPIRED':
      return 'Đơn đặt bàn đã quá hạn phản hồi 30 phút và chuyển sang Expired (409).'
    case 'INSUFFICIENT_CAPACITY':
      return 'Sức chứa khung giờ không đủ để xác nhận đơn này (409 INSUFFICIENT_CAPACITY).'
    case 'INVALID_STATE_TRANSITION':
      return `Chuyển trạng thái không hợp lệ: ${error.detail.message || 'Đơn đã đổi trạng thái'} (409).`
    case 'OUTSIDE_CHECKIN_WINDOW':
      return 'Chỉ được Check-in trong khoảng ±30 phút quanh giờ đặt bàn (409 OUTSIDE_CHECKIN_WINDOW).'
    case 'GRACE_PERIOD_ACTIVE':
      return 'Chưa hết thời gian chờ 30 phút sau giờ hẹn nên chưa thể đánh dấu No-show (409 GRACE_PERIOD_ACTIVE).'
    default:
      if (error.status === 404) {
        return 'Endpoint F5 chưa khả dụng trên backend hiện tại (404). Hãy đảm bảo backend F5 đang chạy.'
      }
      if (error.status === 422) {
        return error.detail.message || 'Vui lòng nhập đầy đủ lý do hợp lệ (422).'
      }
      return error.detail.message || fallback
  }
}

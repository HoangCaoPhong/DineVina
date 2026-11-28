import { FormEvent, useEffect, useState } from 'react'

type OperatingHour = { day_of_week: number; open_time: string; close_time: string; is_active: boolean }
type BlockedSlot = {
  id: string
  blocked_date: string
  start_time: string
  end_time: string
  reason: string
  status: string
  affected_pending_reservation_ids?: string[]
}
type Settings = {
  venue_id: string
  venue_name: string
  max_capacity: number
  default_slot_capacity: number
  revision: number
  operating_hours: OperatingHour[]
  blocked_slots: BlockedSlot[]
}
type Dashboard = {
  summary: {
    pending_reservations: number
    confirmed_today: number
    open_event_inquiries: number
    seats_reserved_today: number
    active_blocked_slots_next_7_days: number
    nearest_response_deadline: string | null
  }
  reservation_queue: {
    total: number
    page: number
    page_size: number
    items: Array<{
      id: string; reservation_code: string; customer_name: string; customer_phone: string
      reserved_date: string; reserved_time: string; party_size: number; status: string
      special_requests: string; response_deadline: string | null
    }>
  }
  event_queue: {
    total: number
    items: Array<{
      id: string; inquiry_code: string; customer_name: string; occasion: string
      preferred_date: string; party_size: number; budget_min_vnd: number
      budget_max_vnd: number; status: string; last_message_preview: string
    }>
  }
}

const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
const timeOptions24h = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, '0')
  const minute = index % 2 === 0 ? '00' : '30'
  return `${hour}:${minute}`
})
const timeOptionsFor = (current: string) =>
  !current || timeOptions24h.includes(current)
    ? timeOptions24h
    : [current, ...timeOptions24h].sort()
const demoVenues = ['v-hcmc-001', 'v-hcmc-002']
const headers = {
  'Content-Type': 'application/json',
  'X-User-Id': 'partner-demo',
  'X-User-Role': 'partner_staff',
  'X-Partner-Venues': demoVenues.join(','),
}

async function readError(response: Response): Promise<string> {
  try {
    const body = await response.json()
    return body?.detail?.message || body?.detail?.code || `HTTP ${response.status}`
  } catch {
    return `HTTP ${response.status}`
  }
}

export default function PartnerF7Modal({ onClose }: { onClose: () => void }) {
  const [venueId, setVenueId] = useState(demoVenues[0])
  const [tab, setTab] = useState<'dashboard' | 'availability'>('dashboard')
  const [settings, setSettings] = useState<Settings | null>(null)
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [capacity, setCapacity] = useState(20)
  const [hours, setHours] = useState<OperatingHour[]>([])
  const [statusFilter, setStatusFilter] = useState('')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [blockDate, setBlockDate] = useState('')
  const [blockStart, setBlockStart] = useState('18:00')
  const [blockEnd, setBlockEnd] = useState('19:00')
  const [blockReason, setBlockReason] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      setError('')
      try {
        const params = new URLSearchParams({ page: String(page), page_size: '8' })
        if (statusFilter) params.set('status', statusFilter)
        if (query) params.set('query', query)
        const [settingsRes, dashboardRes] = await Promise.all([
          fetch(`/api/partner/venues/${venueId}/availability-settings`, { headers }),
          fetch(`/api/partner/venues/${venueId}/dashboard?${params}`, { headers }),
        ])
        if (!settingsRes.ok) throw new Error(await readError(settingsRes))
        if (!dashboardRes.ok) throw new Error(await readError(dashboardRes))
        const settingsBody = await settingsRes.json() as Settings
        const dashboardBody = await dashboardRes.json() as Dashboard
        if (!active) return
        setSettings(settingsBody)
        setCapacity(settingsBody.default_slot_capacity)
        setHours(settingsBody.operating_hours)
        setDashboard(dashboardBody)
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Không tải được dữ liệu F7')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => { active = false }
  }, [venueId, statusFilter, query, page])

  async function refreshAll() {
    setPage(1)
    setQuery((value) => value)
    const [settingsRes, dashboardRes] = await Promise.all([
      fetch(`/api/partner/venues/${venueId}/availability-settings`, { headers }),
      fetch(`/api/partner/venues/${venueId}/dashboard?page=1&page_size=8`, { headers }),
    ])
    if (settingsRes.ok) {
      const body = await settingsRes.json() as Settings
      setSettings(body); setCapacity(body.default_slot_capacity); setHours(body.operating_hours)
    }
    if (dashboardRes.ok) setDashboard(await dashboardRes.json() as Dashboard)
  }

  function updateHour(day: number, patch: Partial<OperatingHour>) {
    setHours((items) => items.map((item) => item.day_of_week === day ? { ...item, ...patch } : item))
  }

  async function saveSettings(event: FormEvent) {
    event.preventDefault()
    if (!settings) return
    setSaving(true); setError(''); setNotice('')
    try {
      const response = await fetch(`/api/partner/venues/${venueId}/availability-settings`, {
        method: 'PUT', headers,
        body: JSON.stringify({
          default_slot_capacity: capacity,
          operating_hours: hours,
          expected_revision: settings.revision,
        }),
      })
      if (!response.ok) throw new Error(await readError(response))
      const body = await response.json() as Settings
      setSettings(body); setCapacity(body.default_slot_capacity); setHours(body.operating_hours)
      setNotice('Đã lưu cấu hình giờ mở cửa và sức chứa.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không lưu được cấu hình')
    } finally { setSaving(false) }
  }

  async function createBlock(event: FormEvent) {
    event.preventDefault()
    setSaving(true); setError(''); setNotice('')
    try {
      const response = await fetch(`/api/partner/venues/${venueId}/blocked-slots`, {
        method: 'POST', headers,
        body: JSON.stringify({ blocked_date: blockDate, start_time: blockStart, end_time: blockEnd, reason: blockReason }),
      })
      if (!response.ok) throw new Error(await readError(response))
      const body = await response.json() as BlockedSlot
      setNotice(body.affected_pending_reservation_ids?.length
        ? `Đã khóa khung giờ. ${body.affected_pending_reservation_ids.length} yêu cầu chờ xác nhận bị ảnh hưởng.`
        : 'Đã khóa khung giờ.')
      setBlockReason('')
      await refreshAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không tạo được khung giờ khóa')
    } finally { setSaving(false) }
  }

  async function cancelBlock(id: string) {
    setError('')
    const response = await fetch(`/api/partner/venues/${venueId}/blocked-slots/${id}`, { method: 'DELETE', headers })
    if (!response.ok) setError(await readError(response))
    else { setNotice('Đã hủy khung giờ khóa.'); await refreshAll() }
  }

  const reservationItems = dashboard?.reservation_queue.items || []
  const eventItems = dashboard?.event_queue.items || []
  const activeBlocks = (settings?.blocked_slots || []).filter((item) => item.status === 'Active')

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="feature-modal workspace-modal f7-modal" role="dialog" aria-modal="true" aria-labelledby="f7-title">
        <div className="modal-heading f7-heading">
          <div><p className="eyebrow">F7 · Availability & Partner Dashboard</p><h2 id="f7-title">Điều phối vận hành nhà hàng</h2><p>Giờ mở cửa, sức chứa, khung giờ khóa và hàng chờ yêu cầu được lưu trong PostgreSQL.</p></div>
          <button className="modal-close" onClick={onClose} aria-label="Đóng">×</button>
        </div>
        <div className="f7-toolbar">
          <label>Nhà hàng demo<select value={venueId} onChange={(event) => { setVenueId(event.target.value); setPage(1) }}>{demoVenues.map((id) => <option key={id} value={id}>{id}</option>)}</select></label>
          <div className="detail-tab-row"><button className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}>Dashboard</button><button className={tab === 'availability' ? 'active' : ''} onClick={() => setTab('availability')}>Giờ & sức chứa</button></div>
        </div>
        {error && <div className="f7-error">{error}</div>}
        {notice && <div className="workspace-message">{notice}</div>}
        {loading ? <div className="workspace-body f7-empty">Đang tải dữ liệu vận hành...</div> : tab === 'dashboard' ? (
          <div className="workspace-body f7-body">
            <div className="f7-summary-grid">
              <article><span>Chờ xác nhận</span><b>{dashboard?.summary.pending_reservations ?? 0}</b></article>
              <article><span>Đã xác nhận hôm nay</span><b>{dashboard?.summary.confirmed_today ?? 0}</b></article>
              <article><span>Yêu cầu tiệc mở</span><b>{dashboard?.summary.open_event_inquiries ?? 0}</b></article>
              <article><span>Ghế đã giữ hôm nay</span><b>{dashboard?.summary.seats_reserved_today ?? 0}</b></article>
              <article><span>Khung khóa 7 ngày</span><b>{dashboard?.summary.active_blocked_slots_next_7_days ?? 0}</b></article>
            </div>
            <form className="f7-filter-row" onSubmit={(event) => event.preventDefault()}>
              <select value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setPage(1) }}><option value="">Tất cả trạng thái</option><option>Pending confirmation</option><option>Confirmed</option></select>
              <input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} placeholder="Tìm mã, tên hoặc SĐT" />
              <button type="button" className="outline-button" onClick={() => void refreshAll()}>Làm mới</button>
            </form>
            <section><div className="detail-section-heading"><div><h3>Yêu cầu đặt bàn</h3><p>Ưu tiên yêu cầu chờ xác nhận theo deadline phản hồi.</p></div><span>{dashboard?.reservation_queue.total ?? 0} yêu cầu</span></div>
              <div className="record-list compact f7-list">{reservationItems.length === 0 ? <div className="empty-inline">Không có yêu cầu phù hợp.</div> : reservationItems.map((item) => <article key={item.id}><div className="record-main"><div className="record-title"><h4>{item.customer_name} · {item.party_size} khách</h4><span className="status-chip pending">{item.status}</span></div><p>{item.reserved_date} · {item.reserved_time} · Mã {item.reservation_code} · {item.customer_phone}</p><p>{item.special_requests || 'Không có ghi chú đặc biệt'}</p></div><small>{item.response_deadline ? new Date(item.response_deadline).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}</small></article>)}</div>
              <div className="f7-pagination"><button disabled={page <= 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>← Trước</button><span>Trang {dashboard?.reservation_queue.page ?? page}</span><button disabled={reservationItems.length < 8} onClick={() => setPage((value) => value + 1)}>Sau →</button></div>
            </section>
            <section><div className="detail-section-heading"><div><h3>Yêu cầu đặt tiệc</h3><p>Theo dõi inquiry mới và đang trao đổi.</p></div><span>{dashboard?.event_queue.total ?? 0} inquiry</span></div>
              <div className="record-list compact f7-list">{eventItems.length === 0 ? <div className="empty-inline">Chưa có inquiry mở.</div> : eventItems.map((item) => <article key={item.id}><div className="record-main"><div className="record-title"><h4>{item.occasion} · {item.party_size} khách</h4><span className="status-chip confirmed">{item.status}</span></div><p>{item.customer_name} · {item.preferred_date} · Ngân sách {item.budget_min_vnd.toLocaleString('vi-VN')}–{item.budget_max_vnd.toLocaleString('vi-VN')}đ</p><p>{item.last_message_preview}</p></div></article>)}</div>
            </section>
          </div>
        ) : (
          <div className="workspace-body f7-body f7-two-column">
            <form className="f7-panel" onSubmit={saveSettings}>
              <div className="detail-section-heading"><div><h3>Giờ mở cửa & sức chứa</h3><p>Áp dụng cho tính năng công khai và giữ chỗ F5.</p></div><span>rev. {settings?.revision}</span></div>
              <label className="f7-capacity">Sức chứa mỗi khung 30 phút<input type="number" min="1" max={settings?.max_capacity || 999} value={capacity} onChange={(event) => setCapacity(Number(event.target.value))} /><small>Tối đa venue: {settings?.max_capacity}</small></label>
              <div className="f7-hours">{hours.map((row) => <div className="f7-hour-row" key={row.day_of_week}><label><input type="checkbox" checked={row.is_active} onChange={(event) => updateHour(row.day_of_week, { is_active: event.target.checked })} />{dayNames[row.day_of_week]}</label><select aria-label={`Giờ mở cửa ${dayNames[row.day_of_week]}`} value={row.open_time} onChange={(event) => updateHour(row.day_of_week, { open_time: event.target.value })}>{timeOptionsFor(row.open_time).map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select><span>–</span><select aria-label={`Giờ đóng cửa ${dayNames[row.day_of_week]}`} value={row.close_time} onChange={(event) => updateHour(row.day_of_week, { close_time: event.target.value })}>{timeOptionsFor(row.close_time).map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select></div>)}</div>
              <button className="primary-button" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu cấu hình'}</button>
            </form>
            <div className="f7-panel">
              <div className="detail-section-heading"><div><h3>Khung giờ khóa</h3><p>Không cho phép khóa nếu trùng booking đã xác nhận.</p></div><span>{activeBlocks.length} đang hoạt động</span></div>
              <form className="f7-block-form" onSubmit={createBlock}><input required type="date" value={blockDate} onChange={(event) => setBlockDate(event.target.value)} /><select aria-label="Giờ bắt đầu" value={blockStart} onChange={(event) => setBlockStart(event.target.value)}>{timeOptionsFor(blockStart).map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select><select aria-label="Giờ kết thúc" value={blockEnd} onChange={(event) => setBlockEnd(event.target.value)}>{timeOptionsFor(blockEnd).map((slot) => <option key={slot} value={slot}>{slot}</option>)}</select><input required value={blockReason} onChange={(event) => setBlockReason(event.target.value)} placeholder="Lý do khóa" /><button className="primary-button small" disabled={saving}>Khóa khung giờ</button></form>
              <div className="f7-block-list">{activeBlocks.length === 0 ? <div className="empty-inline">Chưa có khung giờ bị khóa.</div> : activeBlocks.map((item) => <article key={item.id}><div><b>{item.blocked_date} · {item.start_time}–{item.end_time}</b><p>{item.reason}</p></div><button className="outline-button" onClick={() => void cancelBlock(item.id)}>Hủy khóa</button></article>)}</div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

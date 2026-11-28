import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ALL_RESERVATION_STATUSES,
  FALLBACK_DEMO_VENUES,
  formatBookingDate,
  formatStaffApiError,
  formatVnTimestamp,
  getActorRoleLabel,
  getAdminReservationDetail,
  getStatusMeta,
  probeRbacAccess,
  searchAdminReservations,
} from './staffReservationApi'
import type {
  RbacProbeResult,
  StaffReservation,
  StaffVenueOption,
} from './staffReservationApi'
import './staffReservations.css'

type AdminReservationsProps = {
  adminName: string
  venues: StaffVenueOption[]
}

export default function AdminReservations({ adminName, venues }: AdminReservationsProps) {
  const venueOptions = useMemo(
    () => (venues.length > 0 ? venues : FALLBACK_DEMO_VENUES),
    [venues],
  )

  const [adminId, setAdminId] = useState('admin-001')
  const [searchInput, setSearchInput] = useState('')
  const [appliedQuery, setAppliedQuery] = useState('')
  const [venueFilter, setVenueFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)

  const [items, setItems] = useState<StaffReservation[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<StaffReservation | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')

  const [rbacProbe, setRbacProbe] = useState<RbacProbeResult | null>(null)
  const [probing, setProbing] = useState(false)
  const [reloadTick, setReloadTick] = useState(0)

  const actor = useMemo(() => ({ userId: adminId }), [adminId])

  const refreshList = useCallback(() => {
    setReloadTick((value) => value + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setErrorMessage('')

    searchAdminReservations(
      actor,
      {
        q: appliedQuery || undefined,
        venueId: venueFilter || undefined,
        status: statusFilter || undefined,
        page,
        pageSize: 15,
      },
      controller.signal,
    )
      .then((res) => {
        if (controller.signal.aborted) return
        setItems(res.items)
        setTotal(res.total)
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return
        setItems([])
        setTotal(0)
        setErrorMessage(
          formatStaffApiError(error, 'Không tải được dữ liệu tra cứu đặt bàn quản trị.'),
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [actor, appliedQuery, venueFilter, statusFilter, page, reloadTick])

  useEffect(() => {
    if (!selectedId) {
      setDetail(null)
      setDetailError('')
      return
    }
    const controller = new AbortController()
    setDetailLoading(true)
    setDetailError('')

    getAdminReservationDetail(actor, selectedId, controller.signal)
      .then((res) => {
        if (!controller.signal.aborted) setDetail(res)
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setDetail(null)
          setDetailError(
            formatStaffApiError(error, 'Không tải được chi tiết lịch sử kiểm toán đơn này.'),
          )
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setDetailLoading(false)
      })

    return () => controller.abort()
  }, [actor, selectedId, reloadTick])

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPage(1)
    setAppliedQuery(searchInput.trim())
  }

  async function runAdminRbacProbe(kind: 'partner-role' | 'unauthenticated') {
    setProbing(true)
    try {
      if (kind === 'partner-role') {
        setRbacProbe(
          await probeRbacAccess({
            endpoint: '/api/admin/reservations/support',
            role: 'partner_staff',
            userId: 'partner-001',
            partnerVenues: ['v-hcmc-001'],
          }),
        )
      } else {
        setRbacProbe(
          await probeRbacAccess({
            endpoint: '/api/admin/reservations/support',
            role: null,
          }),
        )
      }
    } finally {
      setProbing(false)
    }
  }

  const pendingCount = items.filter((r) => r.status === 'Pending confirmation').length
  const confirmedCount = items.filter((r) => r.status === 'Confirmed').length
  const terminalCount = items.filter(
    (r) => r.status !== 'Pending confirmation' && r.status !== 'Confirmed',
  ).length
  const totalPages = Math.max(1, Math.ceil(total / 15))

  return (
    <section className="staff-panel" aria-labelledby="admin-f5-heading">
      <div className="staff-header-row">
        <div>
          <h3 id="admin-f5-heading">Tra cứu & lịch sử đặt bàn toàn hệ thống</h3>
          <p className="staff-subtitle">
            Quản trị viên: <b>{adminName || 'Quản trị viên'}</b> · Chế độ tra cứu và kiểm tra lịch sử
          </p>
        </div>
        <button type="button" className="outline-button" onClick={refreshList} disabled={loading}>
          {loading ? 'Đang tải…' : 'Làm mới dữ liệu'}
        </button>
      </div>

      <div className="dashboard-stats">
        <span><b>{total}</b>Tổng đơn tìm thấy</span>
        <span><b>{pendingCount}</b>Đang chờ duyệt</span>
        <span><b>{confirmedCount}</b>Đã xác nhận</span>
        <span><b>{terminalCount}</b>Đã kết thúc / Hủy</span>
      </div>

      <div className="staff-scope-box">
        <div className="staff-scope-row">
          <label className="staff-inline-field">
            <span>Mã quản trị viên</span>
            <input
              value={adminId}
              onChange={(event) => {
                setAdminId(event.target.value)
                setPage(1)
              }}
              placeholder="admin-001"
            />
          </label>
        </div>

        <details>
          <summary style={{ cursor: 'pointer', fontSize: '.8rem', color: 'var(--muted)' }}>
            Kiểm tra phân quyền nâng cao
          </summary>
          <div className="staff-rbac-bar" style={{ marginTop: 10 }}>
            <span>Kiểm tra phân quyền Admin API:</span>
            <button
              type="button"
              className="outline-button"
              disabled={probing}
              onClick={() => runAdminRbacProbe('partner-role')}
            >
              Thử bằng quyền Partner (403)
            </button>
            <button
              type="button"
              className="outline-button"
              disabled={probing}
              onClick={() => runAdminRbacProbe('unauthenticated')}
            >
              Thử không có Header xác thực (401)
            </button>
          </div>

          {rbacProbe && (
            <div
              className={`staff-probe-result ${rbacProbe.blocked ? 'ok' : 'warn'}`}
              role="status"
            >
              <b>
                {rbacProbe.blocked ? '✓ API đã chặn đúng phân quyền:' : 'Kết quả:'} HTTP{' '}
                {rbacProbe.status} · {rbacProbe.code}
              </b>
              <span>
                Endpoint: <code>{rbacProbe.endpoint}</code> · Role gửi đi:{' '}
                <code>{rbacProbe.roleSent}</code> — {rbacProbe.message}
              </span>
            </div>
          )}
        </details>
      </div>

      <form className="staff-filter-bar" onSubmit={handleSearchSubmit}>
        <label className="staff-search-grow">
          <span>Tìm theo mã đơn, mã khách hàng hoặc tên khách</span>
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Nhập mã đặt bàn, tên khách hàng hoặc SĐT..."
          />
        </label>

        <label>
          <span>Nhà hàng</span>
          <select
            value={venueFilter}
            onChange={(event) => {
              setVenueFilter(event.target.value)
              setPage(1)
            }}
          >
            <option value="">Tất cả nhà hàng</option>
            {venueOptions.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.id} — {venue.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Trạng thái</span>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value)
              setPage(1)
            }}
          >
            <option value="">Tất cả trạng thái</option>
            {ALL_RESERVATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {getStatusMeta(status).label}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="primary-button small">
          Tra cứu
        </button>

        {(appliedQuery || venueFilter || statusFilter) && (
          <button
            type="button"
            className="outline-button"
            onClick={() => {
              setSearchInput('')
              setAppliedQuery('')
              setVenueFilter('')
              setStatusFilter('')
              setPage(1)
            }}
          >
            Xóa lọc
          </button>
        )}
      </form>

      {errorMessage && (
        <div className="staff-alert error" role="alert">
          ! {errorMessage}
        </div>
      )}

      <div className="admin-audit-layout">
        <div className="admin-list-column">
          {loading ? (
            <p className="staff-empty" role="status">
              Đang tải danh sách đặt bàn toàn hệ thống…
            </p>
          ) : items.length === 0 ? (
            <div className="staff-empty">Không tìm thấy đơn đặt bàn nào phù hợp.</div>
          ) : (
            <div className="staff-card-list">
              {items.map((item) => {
                const meta = getStatusMeta(item.status)
                const active = selectedId === item.id
                return (
                  <article
                    key={item.id}
                    className={`staff-reservation-card clickable ${active ? 'selected' : ''}`}
                  >
                    <div className="staff-card-top">
                      <div>
                        <div className="staff-card-title-row">
                          <h4>
                            {item.reservation_code} · {item.venue_name || item.venue_id}
                          </h4>
                          <span className={`staff-badge ${meta.tone}`}>{meta.label}</span>
                        </div>
                        <p className="staff-meta-line">
                          Khách: <b>{item.customer_name}</b> (<code>{item.customer_id}</code>) ·{' '}
                          {formatBookingDate(item.reserved_date)} {item.reserved_time} ·{' '}
                          {item.party_size} khách
                        </p>
                      </div>
                      <button
                        type="button"
                        className="outline-button"
                        onClick={() => setSelectedId(item.id)}
                      >
                        {active ? 'Đang xem' : 'Xem audit log'}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {total > 15 && (
            <nav className="staff-pagination" aria-label="Phân trang tra cứu quản trị">
              <button
                type="button"
                className="outline-button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Trang trước
              </button>
              <span>
                Trang {page} / {totalPages}
              </span>
              <button
                type="button"
                className="outline-button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Trang sau
              </button>
            </nav>
          )}
        </div>

        <aside className="admin-detail-column" aria-label="Chi tiết kiểm toán đặt bàn">
          {!selectedId ? (
            <div className="staff-empty">
              Chọn một đơn đặt bàn bên trái để xem chi tiết và toàn bộ lịch sử thay đổi trạng thái.
            </div>
          ) : detailLoading ? (
            <p className="staff-empty" role="status">
              Đang tải chi tiết kiểm toán…
            </p>
          ) : detailError ? (
            <div className="staff-alert error" role="alert">
              ! {detailError}
            </div>
          ) : detail ? (
            <div className="admin-audit-detail">
              <div className="staff-card-title-row">
                <h4>Đơn {detail.reservation_code}</h4>
                <span className={`staff-badge ${getStatusMeta(detail.status).tone}`}>
                  {getStatusMeta(detail.status).label}
                </span>
              </div>

              <dl className="admin-audit-meta">
                <div>
                  <dt>ID bản ghi</dt>
                  <dd><code>{detail.id}</code></dd>
                </div>
                <div>
                  <dt>Nhà hàng</dt>
                  <dd>{detail.venue_name || detail.venue_id} (<code>{detail.venue_id}</code>)</dd>
                </div>
                <div>
                  <dt>Khách hàng</dt>
                  <dd>
                    {detail.customer_name} · {detail.customer_phone} (<code>{detail.customer_id}</code>)
                  </dd>
                </div>
                <div>
                  <dt>Lịch đặt</dt>
                  <dd>
                    {formatBookingDate(detail.reserved_date)} lúc {detail.reserved_time} ·{' '}
                    {detail.party_size} khách
                  </dd>
                </div>
                <div>
                  <dt>Hạn phản hồi đối tác</dt>
                  <dd>{formatVnTimestamp(detail.response_deadline)}</dd>
                </div>
                <div>
                  <dt>Hạn hủy trực tuyến (2h)</dt>
                  <dd>{formatVnTimestamp(detail.cancellation_deadline)}</dd>
                </div>
                {detail.special_requests && (
                  <div>
                    <dt>Yêu cầu thêm</dt>
                    <dd>{detail.special_requests}</dd>
                  </div>
                )}
              </dl>

              <div className="staff-history-box">
                <h5>Lịch sử trạng thái bất biến ({detail.status_history.length} sự kiện)</h5>
                <ol className="staff-timeline">
                  {detail.status_history.map((entry) => (
                    <li key={entry.id}>
                      <div className="staff-timeline-head">
                        <b>
                          {entry.from_state ? `${entry.from_state} → ` : ''}
                          {entry.to_state}
                        </b>
                        <span>
                          {formatVnTimestamp(entry.created_at)} ·{' '}
                          {getActorRoleLabel(entry.actor_role)} (<code>{entry.actor_id}</code>)
                        </span>
                      </div>
                      {entry.reason && <p>{entry.reason}</p>}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </section>
  )
}

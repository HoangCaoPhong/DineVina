import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ALL_RESERVATION_STATUSES,
  FALLBACK_DEMO_VENUES,
  cancelPartnerReservation,
  checkInPartnerReservation,
  confirmPartnerReservation,
  declinePartnerReservation,
  formatBookingDate,
  formatStaffApiError,
  formatVnTimestamp,
  getActorRoleLabel,
  getStatusMeta,
  listPartnerReservations,
  markPartnerNoShow,
  probeRbacAccess,
} from './staffReservationApi'
import type {
  RbacProbeResult,
  StaffReservation,
  StaffVenueOption,
} from './staffReservationApi'
import './staffReservations.css'

type ReasonActionMode = 'decline' | 'cancel' | 'no-show'

type PartnerReservationsProps = {
  staffName: string
  venues: StaffVenueOption[]
  onNotify?: (title: string, message: string) => void
}

const ACTION_CONFIG: Record<
  ReasonActionMode,
  { title: string; label: string; required: boolean; placeholder: string; submitLabel: string }
> = {
  decline: {
    title: 'Từ chối yêu cầu đặt bàn',
    label: 'Lý do từ chối (bắt buộc)',
    required: true,
    placeholder: 'VD: Hết bàn khu vực phòng lạnh vào khung giờ này...',
    submitLabel: 'Xác nhận từ chối',
  },
  cancel: {
    title: 'Hủy vận hành từ phía nhà hàng',
    label: 'Lý do hủy vận hành (bắt buộc)',
    required: true,
    placeholder: 'VD: Sự cố kỹ thuật/bảo trì khu vực bếp đột xuất...',
    submitLabel: 'Xác nhận hủy đơn',
  },
  'no-show': {
    title: 'Đánh dấu khách không đến (No-show)',
    label: 'Ghi chú (không bắt buộc — chỉ áp dụng sau 30 phút kể từ giờ hẹn)',
    required: false,
    placeholder: 'VD: Đã liên hệ điện thoại nhưng khách không nghe máy...',
    submitLabel: 'Xác nhận No-show',
  },
}

export default function PartnerReservations({
  staffName,
  venues,
  onNotify,
}: PartnerReservationsProps) {
  const venueOptions = useMemo(
    () => (venues.length > 0 ? venues : FALLBACK_DEMO_VENUES),
    [venues],
  )
  const venueNameMap = useMemo(
    () => new Map(venueOptions.map((item) => [item.id, item.name])),
    [venueOptions],
  )

  const [staffId, setStaffId] = useState('partner-001')
  const [ownedVenues, setOwnedVenues] = useState<string[]>(['v-hcmc-001', 'v-hcmc-002'])
  const [venueFilter, setVenueFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [page, setPage] = useState(1)

  const [items, setItems] = useState<StaffReservation[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [feedback, setFeedback] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [actionTarget, setActionTarget] = useState<{
    reservation: StaffReservation
    mode: ReasonActionMode
  } | null>(null)
  const [reasonInput, setReasonInput] = useState('')
  const [reasonError, setReasonError] = useState('')
  const [rbacProbe, setRbacProbe] = useState<RbacProbeResult | null>(null)
  const [probing, setProbing] = useState(false)
  const [reloadTick, setReloadTick] = useState(0)

  const actor = useMemo(
    () => ({ userId: staffId, venueIds: ownedVenues }),
    [staffId, ownedVenues],
  )

  const refreshQueue = useCallback(() => {
    setReloadTick((value) => value + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setErrorMessage('')

    listPartnerReservations(
      actor,
      {
        venueId: venueFilter || undefined,
        status: statusFilter || undefined,
        reservedDate: dateFilter || undefined,
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
          formatStaffApiError(error, 'Không tải được hàng chờ đặt bàn của nhà hàng.'),
        )
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })

    return () => controller.abort()
  }, [actor, venueFilter, statusFilter, dateFilter, page, reloadTick])

  function toggleOwnedVenue(venueId: string) {
    setPage(1)
    setOwnedVenues((current) =>
      current.includes(venueId)
        ? current.filter((id) => id !== venueId)
        : [...current, venueId],
    )
  }

  function applyUpdatedReservation(updated: StaffReservation, successText: string) {
    setItems((current) =>
      current.map((row) => (row.id === updated.id ? updated : row)),
    )
    setExpandedId(updated.id)
    setFeedback(successText)
    setErrorMessage('')
    onNotify?.('Cập nhật đặt bàn đối tác', `${updated.reservation_code}: ${successText}`)
  }

  async function handleQuickAction(
    reservation: StaffReservation,
    action: 'confirm' | 'check-in',
  ) {
    setBusyId(reservation.id)
    setFeedback('')
    setErrorMessage('')
    try {
      const updated =
        action === 'confirm'
          ? await confirmPartnerReservation(actor, reservation.id)
          : await checkInPartnerReservation(actor, reservation.id)
      const label =
        action === 'confirm'
          ? `Đã xác nhận đơn ${updated.reservation_code} (Confirmed).`
          : `Đã check-in hoàn tất đơn ${updated.reservation_code} (Completed).`
      applyUpdatedReservation(updated, label)
    } catch (error) {
      setErrorMessage(
        formatStaffApiError(error, 'Thao tác không thành công. Đang tải lại trạng thái.'),
      )
      refreshQueue()
    } finally {
      setBusyId(null)
    }
  }

  async function handleReasonSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!actionTarget) return

    const cfg = ACTION_CONFIG[actionTarget.mode]
    const cleaned = reasonInput.trim()
    if (cfg.required && !cleaned) {
      setReasonError('Vui lòng nhập lý do trước khi xác nhận.')
      return
    }

    setBusyId(actionTarget.reservation.id)
    setReasonError('')
    setErrorMessage('')
    setFeedback('')
    try {
      let updated: StaffReservation
      if (actionTarget.mode === 'decline') {
        updated = await declinePartnerReservation(actor, actionTarget.reservation.id, cleaned)
      } else if (actionTarget.mode === 'cancel') {
        updated = await cancelPartnerReservation(actor, actionTarget.reservation.id, cleaned)
      } else {
        updated = await markPartnerNoShow(actor, actionTarget.reservation.id, cleaned)
      }
      const statusMeta = getStatusMeta(updated.status)
      applyUpdatedReservation(
        updated,
        `Đơn ${updated.reservation_code} đã chuyển sang ${statusMeta.label}.`,
      )
      setActionTarget(null)
      setReasonInput('')
    } catch (error) {
      setErrorMessage(
        formatStaffApiError(error, 'Không thể cập nhật trạng thái đơn đặt bàn.'),
      )
      refreshQueue()
    } finally {
      setBusyId(null)
    }
  }

  async function runRbacProbe(kind: 'customer-role' | 'foreign-venue') {
    setProbing(true)
    try {
      if (kind === 'customer-role') {
        setRbacProbe(
          await probeRbacAccess({
            endpoint: '/api/partner/reservations',
            role: 'customer',
            userId: 'cust-probe-01',
          }),
        )
      } else {
        const unownedVenue =
          venueOptions.find((v) => !ownedVenues.includes(v.id))?.id || 'v-hcmc-003'
        setRbacProbe(
          await probeRbacAccess({
            endpoint: `/api/partner/reservations?venue_id=${encodeURIComponent(unownedVenue)}`,
            role: 'partner_staff',
            userId: staffId,
            partnerVenues: ownedVenues,
          }),
        )
      }
    } finally {
      setProbing(false)
    }
  }

  const pendingCount = items.filter((r) => r.status === 'Pending confirmation').length
  const confirmedCount = items.filter((r) => r.status === 'Confirmed').length
  const completedCount = items.filter((r) => r.status === 'Completed').length
  const totalPages = Math.max(1, Math.ceil(total / 15))
  const quickScopeVenues = venueOptions.slice(0, 4)

  return (
    <section className="staff-panel" aria-labelledby="partner-f5-heading">
      <div className="staff-header-row">
        <div>
          <h3 id="partner-f5-heading">Hàng chờ & xử lý đặt bàn</h3>
          <p className="staff-subtitle">
            Nhân viên phụ trách: <b>{staffName || 'Đối tác'}</b> · Đang quản lý{' '}
            <b>{ownedVenues.length}</b> nhà hàng
          </p>
        </div>
        <button type="button" className="outline-button" onClick={refreshQueue} disabled={loading}>
          {loading ? 'Đang tải…' : 'Làm mới hàng chờ'}
        </button>
      </div>

      <div className="dashboard-stats">
        <span><b>{total}</b>Tổng đơn trong bộ lọc</span>
        <span><b>{pendingCount}</b>Chờ xác nhận</span>
        <span><b>{confirmedCount}</b>Đã xác nhận</span>
        <span><b>{completedCount}</b>Đã hoàn tất</span>
      </div>

      <div className="staff-scope-box">
        <div className="staff-scope-row">
          <label className="staff-inline-field">
            <span>Mã nhân viên</span>
            <input
              value={staffId}
              onChange={(event) => {
                setStaffId(event.target.value)
                setPage(1)
              }}
              placeholder="partner-001"
            />
          </label>
          <div className="staff-chip-group">
            <span>Nhà hàng được phân quyền:</span>
            <div className="staff-chips">
              {quickScopeVenues.map((venue) => {
                const active = ownedVenues.includes(venue.id)
                return (
                  <button
                    key={venue.id}
                    type="button"
                    className={`staff-scope-chip ${active ? 'active' : ''}`}
                    onClick={() => toggleOwnedVenue(venue.id)}
                  >
                    {active ? '✓ ' : '+ '}
                    {venue.name}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <details>
          <summary style={{ cursor: 'pointer', fontSize: '.8rem', color: 'var(--muted)' }}>
            Kiểm tra phân quyền nâng cao
          </summary>
          <div className="staff-rbac-bar" style={{ marginTop: 10 }}>
            <span>Kiểm tra phân quyền API:</span>
            <button
              type="button"
              className="outline-button"
              disabled={probing}
              onClick={() => runRbacProbe('customer-role')}
            >
              Thử gọi bằng quyền Customer (403)
            </button>
            <button
              type="button"
              className="outline-button"
              disabled={probing}
              onClick={() => runRbacProbe('foreign-venue')}
            >
              Thử xem quán ngoài quyền (403)
            </button>
          </div>

          {rbacProbe && (
            <div
              className={`staff-probe-result ${rbacProbe.blocked ? 'ok' : 'warn'}`}
              role="status"
            >
              <b>
                {rbacProbe.blocked ? '✓ Phân quyền đã chặn đúng:' : 'Kết quả kiểm tra:'} HTTP{' '}
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

      <div className="staff-filter-bar">
        <label>
          <span>Lọc theo nhà hàng</span>
          <select
            value={venueFilter}
            onChange={(event) => {
              setVenueFilter(event.target.value)
              setPage(1)
            }}
          >
            <option value="">Tất cả nhà hàng được quyền</option>
            {venueOptions.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.id} — {venue.name}
                {!ownedVenues.includes(venue.id) ? ' (Ngoài quyền → test 403)' : ''}
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
                {getStatusMeta(status).label} ({status})
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Ngày đặt bàn</span>
          <input
            type="date"
            value={dateFilter}
            onChange={(event) => {
              setDateFilter(event.target.value)
              setPage(1)
            }}
          />
        </label>

        {(venueFilter || statusFilter || dateFilter) && (
          <button
            type="button"
            className="outline-button"
            onClick={() => {
              setVenueFilter('')
              setStatusFilter('')
              setDateFilter('')
              setPage(1)
            }}
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {feedback && (
        <div className="staff-alert success" role="status">
          ✓ {feedback}
        </div>
      )}
      {errorMessage && (
        <div className="staff-alert error" role="alert">
          ! {errorMessage}
        </div>
      )}

      {actionTarget && (
        <form className="staff-reason-card" onSubmit={handleReasonSubmit}>
          <div className="staff-reason-header">
            <h4>
              {ACTION_CONFIG[actionTarget.mode].title} ·{' '}
              <code>{actionTarget.reservation.reservation_code}</code>
            </h4>
            <button
              type="button"
              className="outline-button"
              onClick={() => {
                setActionTarget(null)
                setReasonInput('')
                setReasonError('')
              }}
            >
              Đóng
            </button>
          </div>
          <label>
            <span>{ACTION_CONFIG[actionTarget.mode].label}</span>
            <textarea
              rows={3}
              maxLength={500}
              value={reasonInput}
              placeholder={ACTION_CONFIG[actionTarget.mode].placeholder}
              onChange={(event) => {
                setReasonInput(event.target.value)
                setReasonError('')
              }}
            />
          </label>
          {reasonError && <p className="staff-inline-error">{reasonError}</p>}
          <div className="staff-action-row">
            <button
              type="submit"
              className="primary-button small"
              disabled={busyId === actionTarget.reservation.id}
            >
              {busyId === actionTarget.reservation.id
                ? 'Đang xử lý…'
                : ACTION_CONFIG[actionTarget.mode].submitLabel}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="staff-empty" role="status">
          Đang tải danh sách đặt bàn từ API đối tác…
        </p>
      ) : items.length === 0 ? (
        <div className="staff-empty">
          Không có yêu cầu đặt bàn nào khớp với bộ lọc hiện tại.
        </div>
      ) : (
        <div className="staff-card-list">
          {items.map((item) => {
            const meta = getStatusMeta(item.status)
            const isBusy = busyId === item.id
            const isExpanded = expandedId === item.id
            const venueLabel =
              item.venue_name || venueNameMap.get(item.venue_id) || item.venue_id

            return (
              <article key={item.id} className="staff-reservation-card">
                <div className="staff-card-top">
                  <div>
                    <div className="staff-card-title-row">
                      <h4>
                        {item.reservation_code} · {venueLabel}
                      </h4>
                      <span className={`staff-badge ${meta.tone}`}>{meta.label}</span>
                    </div>
                    <p className="staff-meta-line">
                      <b>{item.customer_name}</b> ({item.customer_phone}) ·{' '}
                      <b>
                        {formatBookingDate(item.reserved_date)} lúc {item.reserved_time}
                      </b>{' '}
                      · <b>{item.party_size} khách</b>
                    </p>
                    {item.special_requests && (
                      <p className="staff-note-line">Ghi chú: {item.special_requests}</p>
                    )}
                    <p className="staff-deadline-line">
                      {item.status === 'Pending confirmation'
                        ? `Hạn phản hồi 30p: ${formatVnTimestamp(item.response_deadline)}`
                        : `Cập nhật lúc: ${formatVnTimestamp(item.updated_at)}`}
                    </p>
                  </div>

                  <div className="staff-card-actions">
                    {item.status === 'Pending confirmation' && (
                      <>
                        <button
                          type="button"
                          className="primary-button small"
                          disabled={isBusy}
                          onClick={() => handleQuickAction(item, 'confirm')}
                        >
                          {isBusy ? 'Đang gửi…' : 'Xác nhận'}
                        </button>
                        <button
                          type="button"
                          className="outline-button danger"
                          disabled={isBusy}
                          onClick={() => {
                            setActionTarget({ reservation: item, mode: 'decline' })
                            setReasonInput('')
                            setReasonError('')
                          }}
                        >
                          Từ chối
                        </button>
                      </>
                    )}

                    {item.status === 'Confirmed' && (
                      <>
                        <button
                          type="button"
                          className="primary-button small"
                          disabled={isBusy}
                          onClick={() => handleQuickAction(item, 'check-in')}
                        >
                          Check-in
                        </button>
                        <button
                          type="button"
                          className="outline-button"
                          disabled={isBusy}
                          onClick={() => {
                            setActionTarget({ reservation: item, mode: 'no-show' })
                            setReasonInput('')
                            setReasonError('')
                          }}
                        >
                          No-show
                        </button>
                        <button
                          type="button"
                          className="outline-button danger"
                          disabled={isBusy}
                          onClick={() => {
                            setActionTarget({ reservation: item, mode: 'cancel' })
                            setReasonInput('')
                            setReasonError('')
                          }}
                        >
                          Hủy vận hành
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      className="outline-button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    >
                      {isExpanded
                        ? 'Ẩn lịch sử'
                        : `Lịch sử (${item.status_history.length})`}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="staff-history-box">
                    <h5>Nhật ký chuyển trạng thái ({item.status_history.length} bản ghi)</h5>
                    <ol className="staff-timeline">
                      {item.status_history.map((entry) => (
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
                )}
              </article>
            )
          })}
        </div>
      )}

      {total > 15 && (
        <nav className="staff-pagination" aria-label="Phân trang hàng chờ đối tác">
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
    </section>
  )
}

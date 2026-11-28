import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import {
  bookingDateLabel, cancelReservation, deadlineLabel, demoCustomerId, getReservation, listReservations,
  ReservationApiError, reservationError, statusLabel,
} from './reservationApi'
import type { Reservation } from './reservationApi'

const actorLabels: Record<string, string> = {
  customer: 'Thực khách',
  partner_staff: 'Nhà hàng',
  administrator: 'Quản trị viên',
  system: 'Hệ thống',
}

function Status({ status }: { status: string }) {
  const className = status === 'Confirmed' ? 'confirmed' : status === 'Pending confirmation' ? 'pending' : ''
  return <span className={`status-chip ${className}`}>{statusLabel(status)}</span>
}

function cancellationCutoff(reservation: Reservation) {
  return reservation.status === 'Confirmed' ? Date.parse(reservation.cancellation_deadline) : null
}

function ReservationSchedule({ reservation }: { reservation: Reservation }) {
  return <>{bookingDateLabel(reservation.reserved_date)} · {reservation.reserved_time} · {reservation.party_size} khách</>
}

const sampleReservationId = 'ui-confirmed-reservation'

function confirmedSample(): Reservation {
  const arrival = new Date(Date.now() + 2 * 86_400_000)
  const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh', dateStyle: 'short' }).format(arrival)
  return {
    id: sampleReservationId,
    reservation_code: 'DV-MAU01',
    venue_name: 'Bếp DineVina Demo',
    venue_hotline: '',
    reserved_date: date,
    reserved_time: '19:00',
    party_size: 4,
    special_requests: '',
    status: 'Confirmed',
    response_deadline: '',
    cancellation_deadline: `${date}T17:00:00+07:00`,
    status_history: [{ id: 'sample-confirmed', to_state: 'Confirmed', actor_role: 'partner_staff', reason: '', created_at: new Date().toISOString() }],
  }
}

export default function CustomerReservations({ customerId, initialId }: {
  customerId: string
  initialId: string | null
}) {
  const [page, setPage] = useState(1)
  const [sample, setSample] = useState(() =>
    import.meta.env.DEV && customerId === demoCustomerId('minhanh@dinevina.vn') ? confirmedSample() : null,
  )
  const [selection, setSelection] = useState<{ id: string; cancel: boolean } | null>(
    initialId ? { id: initialId, cancel: false } : null,
  )
  function cancelSample(reason: string) {
    setSample((current) => current && ({
      ...current,
      status: 'Cancelled by customer',
      status_history: [...current.status_history, {
        id: 'sample-cancelled', to_state: 'Cancelled by customer', actor_role: 'customer', reason, created_at: new Date().toISOString(),
      }],
    }))
  }

  return selection
    ? <ReservationDetail key={selection.id} customerId={customerId} id={selection.id} startCancellation={selection.cancel}
        sample={selection.id === sample?.id ? sample : null} onCancelSample={cancelSample} onBack={() => setSelection(null)} />
    : <ReservationList key={page} customerId={customerId} page={page} sample={sample}
        onPageChange={setPage} onSelect={(id, cancel = false) => setSelection({ id, cancel })} />
}

function ReservationList({ customerId, page, sample, onPageChange, onSelect }: {
  customerId: string
  page: number
  sample: Reservation | null
  onPageChange: (page: number) => void
  onSelect: (id: string, cancel?: boolean) => void
}) {
  const [data, setData] = useState<Awaited<ReturnType<typeof listReservations>> | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [revision, setRevision] = useState(0)

  function reload() {
    setData(null)
    setErrorMessage('')
    setRevision((value) => value + 1)
  }

  useEffect(() => {
    const controller = new AbortController()
    listReservations(customerId, page, controller.signal).then((next) => {
      if (!controller.signal.aborted) setData(next)
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setErrorMessage(reservationError(error, 'Không tải được lịch đặt bàn.'))
    })
    return () => controller.abort()
  }, [customerId, page, revision])

  const savedItems = data?.items.filter((item) => !sample || item.reservation_code !== 'DV-FB5CC7') ?? []
  const items = sample && page === 1 ? [sample, ...savedItems] : savedItems

  return (
    <section aria-labelledby="customer-reservations-title">
      <div className="detail-section-heading">
        <div>
          <h3 id="customer-reservations-title">Lịch đặt bàn</h3>
          <p>Hủy trực tuyến khi bàn đã xác nhận và còn ít nhất 2 giờ trước giờ đến.</p>
        </div>
        {data && <button className="outline-button" type="button" onClick={reload}>Cập nhật</button>}
      </div>
      {errorMessage ? (
        <div className="reservation-options">
          <p className="reservation-error" role="alert">{errorMessage}</p>
          <button type="button" className="outline-button" onClick={reload}>Thử lại</button>
        </div>
      ) : !data && <p role="status">Đang tải lịch đặt bàn…</p>}
      {data && items.length === 0 && <p className="empty-inline">Bạn chưa có yêu cầu đặt bàn.</p>}
      {items.length > 0 && (
        <ul className="customer-reservation-list">
          {items.map((item) => {
            const cutoff = cancellationCutoff(item)
            const canCancel = cutoff !== null && Date.now() <= cutoff
            return (
              <li key={item.id}>
                <div><h4>{item.venue_name || 'Yêu cầu đặt bàn'}</h4><p><ReservationSchedule reservation={item} /> · Mã {item.reservation_code}{item.id === sampleReservationId && ' · Dữ liệu mô phỏng'}</p></div>
                <Status status={item.status} />
                <div className="reservation-row-actions">
                  <button type="button" className="outline-button" onClick={() => onSelect(item.id)} aria-label={`Xem chi tiết ${item.reservation_code}`}>Xem chi tiết</button>
                  {canCancel && (
                    <button type="button" className="outline-button cancel-booking-button" onClick={() => onSelect(item.id, true)}
                      aria-label={`Hủy đặt bàn ${item.reservation_code}`}>Hủy đặt bàn</button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
      {data && data.total > data.page_size && (
        <nav className="reservation-options" aria-label="Trang lịch đặt bàn">
          <button type="button" className="outline-button" disabled={data.page <= 1} onClick={() => onPageChange(data.page - 1)}>Trang trước</button>
          <span>Trang {data.page} / {Math.ceil(data.total / data.page_size)}</span>
          <button type="button" className="outline-button" disabled={data.page * data.page_size >= data.total} onClick={() => onPageChange(data.page + 1)}>Trang tiếp</button>
        </nav>
      )}
    </section>
  )
}

function ReservationDetail({ customerId, id, startCancellation, sample, onCancelSample, onBack }: {
  customerId: string
  id: string
  startCancellation: boolean
  sample: Reservation | null
  onCancelSample: (reason: string) => void
  onBack: () => void
}) {
  const [loadedReservation, setReservation] = useState<Reservation | null>(null)
  const reservation = sample ?? loadedReservation
  const isSample = sample !== null
  const [loadError, setLoadError] = useState('')
  const [revision, setRevision] = useState(0)
  const [cancelOpen, setCancelOpen] = useState(startCancellation)
  const [cancelling, setCancelling] = useState(false)
  const [reason, setReason] = useState('')
  const [actionError, setActionError] = useState('')
  const [invalidReason, setInvalidReason] = useState(false)
  const [cutoffHotline, setCutoffHotline] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now)
  const writing = useRef(false)
  const cutoff = reservation ? cancellationCutoff(reservation) : null

  function reload() {
    setReservation(null)
    setLoadError('')
    setRevision((value) => value + 1)
  }

  useEffect(() => {
    if (isSample) return
    const controller = new AbortController()
    getReservation(customerId, id, controller.signal).then((value) => {
      if (!controller.signal.aborted) {
        setNow(Date.now())
        setReservation(value)
      }
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setLoadError(reservationError(error, 'Không tải được chi tiết đặt bàn.'))
    })
    return () => controller.abort()
  }, [customerId, id, isSample, revision])

  useEffect(() => {
    if (cutoff === null || !Number.isFinite(cutoff) || cutoff < now) return
    const timer = window.setTimeout(() => setNow(Date.now()), Math.min(cutoff - now + 1, 2_147_483_647))
    return () => window.clearTimeout(timer)
  }, [cutoff, now])

  const canCancel = cutoff !== null && cutoffHotline === null && now <= cutoff

  async function cancel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!reservation || !canCancel || writing.current) return
    const cleanedReason = reason.trim()
    if (!cleanedReason) {
      setInvalidReason(true)
      return
    }

    if (isSample) {
      onCancelSample(cleanedReason)
      setCancelOpen(false)
      setReason('')
      return
    }

    writing.current = true
    setCancelling(true)
    setActionError('')
    try {
      setReservation(await cancelReservation(customerId, id, cleanedReason))
      setCancelOpen(false)
      setReason('')
    } catch (error) {
      const outcomeUncertain = !(error instanceof ReservationApiError) || error.status >= 500
      const mustRefresh = outcomeUncertain || (error instanceof ReservationApiError && [403, 404, 409].includes(error.status))
      if (error instanceof ReservationApiError && error.detail.code === 'CANCELLATION_CUTOFF_PASSED') {
        setCutoffHotline(error.detail.venue_hotline ?? reservation.venue_hotline)
      }
      setActionError(reservationError(error, 'Chưa thể xác nhận kết quả hủy.'))
      if (mustRefresh) {
        try {
          const latest = await getReservation(customerId, id)
          setNow(Date.now())
          setReservation(latest)
          if (latest.status !== 'Confirmed') {
            setCancelOpen(false)
            setReason('')
          }
          if (outcomeUncertain && latest.status === 'Cancelled by customer') setActionError('')
          if (outcomeUncertain && latest.status === 'Confirmed') {
            setActionError('Bàn vẫn đang được xác nhận. Bạn có thể thử hủy lại.')
          }
        } catch (refreshError) {
          setReservation(null)
          setLoadError(reservationError(refreshError, 'Chưa thể xác minh trạng thái. Hãy tải lại chi tiết trước khi thử hủy lần nữa.'))
        }
      }
    } finally {
      writing.current = false
      setCancelling(false)
    }
  }

  const hotline = cutoffHotline ?? reservation?.venue_hotline
  return (
    <section aria-labelledby="reservation-details-title" className="customer-reservation-detail">
      <div className="reservation-options">
        <button className="outline-button" type="button" onClick={onBack} disabled={cancelling}>Về lịch đặt bàn</button>
        {reservation && !isSample && <button className="outline-button" type="button" onClick={reload} disabled={cancelling}>Cập nhật</button>}
      </div>
      <h3 id="reservation-details-title">{reservation?.venue_name || 'Chi tiết đặt bàn'}</h3>
      {loadError ? (
        <div className="reservation-options">
          <p className="reservation-error" role="alert">{loadError}</p>
          <button type="button" className="outline-button" onClick={reload}>Thử lại</button>
        </div>
      ) : !reservation ? <p role="status">Đang tải chi tiết…</p> : (
        <>
          <p><ReservationSchedule reservation={reservation} /> · Mã <b>{reservation.reservation_code}</b></p>
          <div role="status"><Status status={reservation.status} /></div>
          {isSample && <p>Dữ liệu mô phỏng</p>}
          {reservation.special_requests && <p>Yêu cầu thêm: {reservation.special_requests}</p>}
          {reservation.status === 'Pending confirmation' && (
            <p>Nhà hàng phản hồi trước {deadlineLabel(reservation.response_deadline)} (giờ Việt Nam). Nút hủy xuất hiện khi bàn đã được xác nhận và còn trong hạn hủy.</p>
          )}
          {reservation.status === 'Confirmed' && <p>Hạn hủy trực tuyến: {deadlineLabel(reservation.cancellation_deadline)} (giờ Việt Nam).</p>}
          {reservation.status === 'Confirmed' && !canCancel && !cancelling && (
            <p>Đã qua hạn hủy trực tuyến.{hotline && <> Liên hệ nhà hàng: <a href={`tel:${hotline.replace(/[^\d+]/g, '')}`}>{hotline}</a>.</>}</p>
          )}
          {actionError && <p className="reservation-error" role="alert">{actionError}</p>}
          {canCancel && !cancelOpen && <button className="outline-button cancel-booking-button" type="button" onClick={() => setCancelOpen(true)}>Hủy đặt bàn</button>}
          {canCancel && cancelOpen && (
            <form className="reservation-cancel-form" onSubmit={cancel}>
              <fieldset className="reservation-fields" disabled={cancelling}>
                <legend>Hủy yêu cầu {reservation.reservation_code}</legend>
                <label>Lý do hủy (bắt buộc)
                  <textarea required maxLength={500} autoFocus value={reason} aria-invalid={invalidReason} aria-describedby={invalidReason ? 'cancel-reason-error' : undefined} onChange={(event) => { setReason(event.target.value); setInvalidReason(false) }} />
                </label>
                {invalidReason && <p id="cancel-reason-error" className="reservation-error" role="alert">Vui lòng nhập lý do hủy.</p>}
                <div className="reservation-options">
                  <button type="button" className="outline-button" onClick={() => { setCancelOpen(false); setReason(''); setInvalidReason(false) }}>Giữ đặt bàn</button>
                  <button className="primary-button" type="submit">{cancelling ? 'Đang hủy…' : 'Xác nhận hủy'}</button>
                </div>
              </fieldset>
            </form>
          )}
          <section className="reservation-history" aria-label="Lịch sử trạng thái">
            <h4>Lịch sử trạng thái</h4>
            {reservation.status_history.length === 0 && <p>Chưa có lịch sử trạng thái.</p>}
            <ol>
              {reservation.status_history.map((entry) => (
                <li key={entry.id}>
                  <b>{statusLabel(entry.to_state)}</b>
                  <span>{deadlineLabel(entry.created_at)} · {actorLabels[entry.actor_role] ?? entry.actor_role}</span>
                  {entry.reason && <p>{entry.reason}</p>}
                </li>
              ))}
            </ol>
          </section>
        </>
      )}
    </section>
  )
}

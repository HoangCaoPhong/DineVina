import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import BookingCriteriaFields from './BookingCriteriaFields'
import ReservationDialog from './ReservationDialog'
import {
  bookingDateLabel, deadlineLabel, loadAvailability, reservationError, reservationKey,
  ReservationApiError, statusLabel, submitReservation, todayInVietnam,
} from './reservationApi'
import type { AvailabilitySlot, BookingLocation, Reservation, ReservationRequest } from './reservationApi'

export type BookingCriteria = { date: string; partySize: number; preferredTime: string }

type Availability =
  | { status: 'idle' | 'loading' }
  | { status: 'ready'; slots: AvailabilitySlot[] }
  | { status: 'error'; message: string }

const steps = ['Thông tin buổi ăn', 'Chọn khung giờ', 'Thông tin đặt bàn']

function isBookable(slot: AvailabilitySlot) {
  return slot.status === 'Available' && !slot.is_blocked
}

function minutesAt(time: string) {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function BookingSummary({ criteria, time }: { criteria: BookingCriteria; time?: string }) {
  return (
    <dl className="booking-summary">
      <div><dt>Ngày đến</dt><dd>{bookingDateLabel(criteria.date)}</dd></div>
      <div><dt>Số khách</dt><dd>{criteria.partySize} người</dd></div>
      {(time || criteria.preferredTime) && (
        <div><dt>{time ? 'Giờ đến' : 'Giờ mong muốn'}</dt><dd>{time || criteria.preferredTime}</dd></div>
      )}
    </dl>
  )
}

export default function BookingModal({ venue, initialCriteria, customer, signedIn, visible, onSignIn, onClose, onTrack, onFindOther, onChangeBranch, demoSlots }: {
  venue: BookingLocation
  demoSlots?: AvailabilitySlot[]
  initialCriteria?: BookingCriteria
  customer: { id: string; name: string } | null
  signedIn: boolean
  visible: boolean
  onSignIn: () => void
  onClose: () => void
  onTrack: (id: string) => void
  onFindOther: (criteria: BookingCriteria) => void
  onChangeBranch?: (criteria: BookingCriteria) => void
}) {
  const today = todayInVietnam()
  const maximumPartySize = Math.min(venue.maxCapacity ?? 50, 50)
  const [date, setDate] = useState(initialCriteria?.date && initialCriteria.date >= today ? initialCriteria.date : today)
  const [guests, setGuests] = useState(String(initialCriteria?.partySize ?? Math.min(2, maximumPartySize)))
  const [preferredTime, setPreferredTime] = useState(initialCriteria?.preferredTime ?? '')
  const [query, setQuery] = useState<BookingCriteria | null>(null)
  const [availability, setAvailability] = useState<Availability>({ status: 'idle' })
  const [time, setTime] = useState('')
  const [contactName, setContactName] = useState<string | null>(null)
  const [phone, setPhone] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<Reservation | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [phoneError, setPhoneError] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const attempt = useRef<{ customerId: string; payload: string; key: string } | null>(null)
  const writing = useRef(false)
  const stepHeading = useRef<HTMLHeadingElement>(null)

  const isDemo = demoSlots !== undefined
  const step = time && query ? 3 : query ? 2 : 1
  const slots = availability.status === 'ready' ? availability.slots : []
  const bookable = slots.filter(isBookable)
  const unavailablePreference = Boolean(query?.preferredTime && !bookable.some((slot) => slot.time === query.preferredTime))
  const orderedSlots = query?.preferredTime
    ? [...slots].sort((left, right) => {
        const preferred = minutesAt(query.preferredTime)
        return Number(isBookable(right)) - Number(isBookable(left))
          || Math.abs(minutesAt(left.time) - preferred) - Math.abs(minutesAt(right.time) - preferred)
      })
    : slots
  const displayedSlots = orderedSlots.filter((slot) => !suggestions.includes(slot.time))

  useEffect(() => {
    if (visible && step > 1) stepHeading.current?.focus()
  }, [step, visible])

  useEffect(() => {
    if (!query) return
    if (demoSlots !== undefined) {
      setAvailability({ status: 'ready', slots: demoSlots })
      return
    }
    const controller = new AbortController()
    loadAvailability(venue.id, query.date, query.partySize, controller.signal)
      .then((slots) => {
        if (!controller.signal.aborted) setAvailability({ status: 'ready', slots })
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          setAvailability({ status: 'error', message: reservationError(error, 'Không tải được khung giờ. Vui lòng thử lại.') })
        }
      })
    return () => controller.abort()
  }, [query, venue.id, demoSlots])

  function editCriteria() {
    setQuery(null)
    setAvailability({ status: 'idle' })
    chooseTime('')
  }

  function search(criteria: BookingCriteria) {
    setAvailability({ status: 'loading' })
    chooseTime('')
    setQuery(criteria)
  }

  function lookup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (date < todayInVietnam()) {
      setErrorMessage('Vui lòng chọn ngày chưa qua.')
      return
    }
    search({ date, partySize: Number(guests), preferredTime })
  }

  function chooseTime(nextTime: string) {
    setTime(nextTime)
    setErrorMessage('')
    setSuggestions([])
  }

  async function book(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isDemo || !customer || !time || !query || writing.current) return

    const name = (contactName ?? customer.name).trim()
    const normalizedPhone = phone.replace(/[\s.()-]/g, '')
    if (!name) {
      setErrorMessage('Vui lòng nhập tên người đặt bàn.')
      return
    }
    if (!/^(?:0|\+84)\d{9,10}$/.test(normalizedPhone)) {
      setPhoneError(true)
      return
    }

    const request: ReservationRequest = {
      venue_id: venue.id,
      reserved_date: query.date,
      reserved_time: time,
      party_size: query.partySize,
      customer_name: name,
      customer_phone: normalizedPhone,
      special_requests: note.trim(),
    }
    const payload = JSON.stringify(request)
    if (attempt.current?.payload !== payload || attempt.current.customerId !== customer.id) {
      attempt.current = { customerId: customer.id, payload, key: reservationKey() }
    }
    writing.current = true
    setSubmitting(true)
    setErrorMessage('')
    try {
      setResult(await submitReservation(customer.id, request, attempt.current.key))
      attempt.current = null
    } catch (error) {
      const uncertain = !(error instanceof ReservationApiError) || error.status >= 500
      setErrorMessage(reservationError(
        error,
        uncertain
          ? 'Chưa xác định được yêu cầu đã được ghi nhận hay chưa. Hãy gửi lại với cùng thông tin hoặc kiểm tra Lịch của tôi.'
          : 'Không gửi được yêu cầu. Vui lòng kiểm tra lại thông tin.',
      ))
      if (error instanceof ReservationApiError && ['SLOT_FULL', 'INVALID_SLOT', 'PAST_DATETIME', 'VENUE_NOT_FOUND'].includes(error.detail.code ?? '')) {
        setTime('')
        setSuggestions(error.detail.suggested_slots ?? [])
        setAvailability({
          status: 'ready',
          slots: error.detail.code === 'SLOT_FULL'
            ? slots.map((slot) => slot.time === time ? { ...slot, status: 'Sold out' } : slot)
            : [],
        })
      }
    } finally {
      writing.current = false
      setSubmitting(false)
    }
  }

  return (
    <ReservationDialog label="Đặt bàn" className="booking-modal" visible={visible} busy={submitting} onClose={onClose}>
      <div className="booking-layout">
        <aside className="booking-venue-panel" aria-label="Nhà hàng đang chọn">
          <div className="booking-venue-photo">
            {venue.image && <img src={venue.image} alt="" onError={(event) => { event.currentTarget.hidden = true }} />}
          </div>
          <div>
            <p className="eyebrow">{isDemo ? 'Mô phỏng đặt bàn' : 'Đặt bàn'}</p>
            <h2>{venue.name}</h2>
            <p className="booking-venue-address">{venue.address || venue.area}</p>
            {onChangeBranch && !result && (
              <button type="button" className="outline-button booking-change-location" disabled={submitting}
                onClick={() => onChangeBranch({ date, partySize: query?.partySize ?? (Number(guests) || 2), preferredTime: time || preferredTime })}>
                Đổi chi nhánh
              </button>
            )}
          </div>
        </aside>

        <div className="booking-main">
          {result ? (
            <div className="booking-success" role="status">
              <span>✓</span>
              <h3>Yêu cầu {result.reservation_code} đã được ghi nhận</h3>
              <p><b>{statusLabel(result.status)}</b> · {bookingDateLabel(result.reserved_date)} lúc {result.reserved_time} · {result.party_size} khách</p>
              {result.status === 'Pending confirmation' && <p>Nhà hàng phản hồi trước {deadlineLabel(result.response_deadline)} (giờ Việt Nam). Bàn được xác nhận khi nhà hàng đồng ý.</p>}
              <button type="button" className="primary-button" onClick={() => onTrack(result.id)}>Xem yêu cầu trong Lịch của tôi</button>
            </div>
          ) : (
            <>
              <ol className="booking-steps" aria-label="Tiến trình đặt bàn">
                {steps.map((label, index) => (
                  <li key={label} aria-current={step === index + 1 ? 'step' : undefined}>
                    <span aria-hidden="true">{index + 1}</span>{label}
                  </li>
                ))}
              </ol>

              {step === 1 && (
                <form onSubmit={lookup}>
                  <fieldset className="reservation-fields">
                    <legend>Bạn muốn đến khi nào?</legend>
                    <BookingCriteriaFields
                      date={date}
                      today={today}
                      openingHours={venue.hours}
                      preferredTime={preferredTime}
                      guests={guests}
                      capacity={maximumPartySize}
                      onDate={setDate}
                      onTime={setPreferredTime}
                      onGuests={setGuests}
                    />
                    {errorMessage && <p className="reservation-error" role="alert">{errorMessage}</p>}
                    <button className="primary-button full" type="submit">Tìm bàn</button>
                  </fieldset>
                </form>
              )}

              {step === 2 && query && (
                <section className="booking-step-content" aria-busy={availability.status === 'loading'}>
                  <h3 ref={stepHeading} tabIndex={-1}>Chọn khung giờ</h3>
                  <BookingSummary criteria={query} />
                  {availability.status === 'loading' && <p role="status">Đang kiểm tra chỗ trống…</p>}
                  {availability.status === 'error' && <p className="reservation-error" role="alert">{availability.message}</p>}
                  {errorMessage && <p className="reservation-error" role="alert">{errorMessage}</p>}
                  {availability.status === 'ready' && (
                    <>
                      {suggestions.length > 0 && (
                        <div className="reservation-options" role="group" aria-label="Giờ thay thế">
                          <span>Khung giờ gần nhất còn chỗ:</span>
                          {suggestions.map((slot) => <button type="button" className="outline-button" key={slot} onClick={() => chooseTime(slot)}>{slot}</button>)}
                        </div>
                      )}
                      {unavailablePreference && bookable.length > 0 && (
                        <p role="status">Khung {query.preferredTime} không khả dụng. Các giờ còn chỗ gần nhất được đưa lên đầu.</p>
                      )}
                      {displayedSlots.length > 0 && (
                        <div className="reservation-slots" role="group" aria-label="Chọn giờ đến">
                          {displayedSlots.map((slot) => (
                            <button type="button" key={slot.time} disabled={!isBookable(slot)}
                              data-preferred={slot.time === query.preferredTime && isBookable(slot) ? 'true' : undefined}
                              onClick={() => chooseTime(slot.time)}>
                              <b>{slot.time}</b>
                              {!isBookable(slot) && <span>Không khả dụng</span>}
                            </button>
                          ))}
                        </div>
                      )}
                      {bookable.length === 0 && suggestions.length === 0 && <p role="status">Quán chưa có khung giờ phù hợp cho {query.partySize} khách vào ngày này.</p>}
                      {bookable.length > 0 && <p className="booking-availability-note">{isDemo ? 'Các khung giờ là dữ liệu mô phỏng.' : 'Giờ Việt Nam. Quán sẽ kiểm tra lại chỗ trống khi bạn gửi yêu cầu.'}</p>}
                    </>
                  )}
                  <div className="reservation-options booking-step-actions">
                    <button type="button" className="outline-button" onClick={editCriteria}>Đổi ngày, giờ hoặc số khách</button>
                    {availability.status === 'error' && <button type="button" className="primary-button" onClick={() => search({ ...query })}>Thử lại</button>}
                    {!isDemo && availability.status === 'ready' && (bookable.length === 0 || unavailablePreference || Boolean(errorMessage)) && (
                      <button type="button" className="outline-button" onClick={() => onFindOther(query)}>Xem quán khác</button>
                    )}
                  </div>
                </section>
              )}

              {step === 3 && query && (
                <section className="booking-confirmation">
                  <div className="booking-step-content">
                    <h3 ref={stepHeading} tabIndex={-1}>Kiểm tra thông tin trước khi gửi</h3>
                    <BookingSummary criteria={query} time={time} />
                    <button type="button" className="outline-button" disabled={submitting} onClick={() => chooseTime('')}>Chọn khung giờ khác</button>
                    {errorMessage && <p className="reservation-error" role="alert">{errorMessage}</p>}
                  </div>
                  {isDemo ? (
                    <div className="booking-step-content">
                      <p role="status">Đây là bản mô phỏng. Thông tin trên chỉ dùng để xem trước.</p>
                      <button type="button" className="primary-button" onClick={onClose}>Kết thúc mô phỏng</button>
                    </div>
                  ) : customer ? (
                    <form onSubmit={book}>
                      <fieldset className="reservation-fields" disabled={submitting}>
                        <legend>Thông tin đặt bàn lúc {time}</legend>
                        <div className="form-grid">
                          <label>Họ và tên<input required autoComplete="name" maxLength={120} value={contactName ?? customer.name} onChange={(event) => setContactName(event.target.value)} /></label>
                          <label>Số điện thoại
                            <input required type="tel" autoComplete="tel" maxLength={32} aria-invalid={phoneError} aria-describedby={phoneError ? 'booking-phone-error' : undefined} value={phone} onChange={(event) => { setPhone(event.target.value); setPhoneError(false) }} />
                            {phoneError && <span id="booking-phone-error" className="reservation-error" role="alert">Nhập số điện thoại hợp lệ (bắt đầu bằng 0 hoặc +84).</span>}
                          </label>
                        </div>
                        <label>Ghi chú cho quán (không bắt buộc)
                          <textarea placeholder="Ví dụ: cần ghế trẻ em hoặc muốn ngồi ngoài trời" maxLength={500} value={note} onChange={(event) => setNote(event.target.value)} />
                        </label>
                        <p className="demo-note">Bạn có thể ghi vị trí ngồi mong muốn để quán xem xét. Nhà hàng có 30 phút để phản hồi yêu cầu đặt bàn.</p>
                        <button type="submit" className="primary-button full">{submitting ? 'Đang gửi…' : 'Gửi yêu cầu đặt bàn'}</button>
                      </fieldset>
                    </form>
                  ) : (
                    <div className="booking-sign-in">
                      <button type="button" className="primary-button" onClick={onSignIn}>{signedIn ? 'Đổi sang vai trò thực khách' : 'Đăng nhập để đặt bàn'}</button>
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </ReservationDialog>
  )
}

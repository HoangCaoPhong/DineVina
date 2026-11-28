import { useId, useRef, useState } from 'react'
import { bookingDateLabel } from './reservationApi'

const weekdays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const minutesPerDay = 24 * 60

function twoDigits(value: number) {
  return String(value).padStart(2, '0')
}

function serviceTimeChoices(openingHours: string, selected: string) {
  const choicesByHour = new Map<string, Set<string>>()
  const [selectedHour, selectedMinute] = selected.split(':').map(Number)
  const selectedTime = selectedHour * 60 + selectedMinute
  const ranges = openingHours.matchAll(/(\d{1,2}):([0-5]\d)\s*[-–—]\s*(\d{1,2}):([0-5]\d)/g)

  for (const [, openHour, openMinute, closeHour, closeMinute] of ranges) {
    const start = Number(openHour) * 60 + Number(openMinute)
    const close = Number(closeHour) * 60 + Number(closeMinute)
    if (start >= minutesPerDay || close > minutesPerDay || start === close) continue

    const end = close < start ? close + minutesPerDay : close
    const times = new Set([start])
    for (let time = Math.ceil(start / 15) * 15; time < end; time += 15) times.add(time)

    const preferred = selectedTime < start ? selectedTime + minutesPerDay : selectedTime
    if (preferred >= start && preferred < end) times.add(preferred)

    for (const time of [...times].sort((left, right) => left - right)) {
      const hour = twoDigits(Math.floor(time % minutesPerDay / 60))
      const minute = twoDigits(time % 60)
      const minutes = choicesByHour.get(hour) ?? new Set<string>()
      minutes.add(minute)
      choicesByHour.set(hour, minutes)
    }
  }

  return [...choicesByHour].map(([hour, minutes]) => ({ hour, minutes: [...minutes].sort() }))
}

function monthStart(date: string) {
  return new Date(date.slice(0, 7) + '-01T00:00:00Z')
}

function shiftMonth(month: Date, offset: number) {
  const next = new Date(month)
  next.setUTCMonth(next.getUTCMonth() + offset)
  return next
}

function DateChoices({ selected, today, onSelect, id }: {
  selected: string
  today: string
  id: string
  onSelect: (date: string) => void
}) {
  const [month, setMonth] = useState(() => monthStart(selected))
  const year = month.getUTCFullYear()
  const monthNumber = month.getUTCMonth() + 1
  const monthText = `Tháng ${monthNumber}, ${year}`
  const daysInMonth = new Date(shiftMonth(month, 1).getTime() - 1).getUTCDate()
  const firstColumn = (month.getUTCDay() + 6) % 7
  const prefix = month.toISOString().slice(0, 7)

  return (
    <section id={id} className="booking-picker" aria-label="Lịch chọn ngày">
      <div className="booking-picker-navigation">
        <button type="button" className="booking-icon-button" aria-label="Tháng trước" disabled={month <= monthStart(today)} onClick={() => setMonth(shiftMonth(month, -1))}>‹</button>
        <b aria-live="polite">{monthText}</b>
        <button type="button" className="booking-icon-button" aria-label="Tháng sau" onClick={() => setMonth(shiftMonth(month, 1))}>›</button>
      </div>
      <div className="booking-calendar">
        {weekdays.map((day) => <span key={day} className="booking-weekday" aria-hidden="true">{day}</span>)}
        {Array.from({ length: firstColumn }, (_, index) => <span key={`blank-${index}`} aria-hidden="true" />)}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1
          const date = `${prefix}-${String(day).padStart(2, '0')}`
          return (
            <button type="button" className="booking-picker-choice" key={date} aria-label={bookingDateLabel(date)}
              aria-current={date === today ? 'date' : undefined}
              aria-pressed={date === selected} disabled={date < today} onClick={() => onSelect(date)}>
              {day}
            </button>
          )
        })}
      </div>
    </section>
  )
}

function TimeChoices({ openingHours, selected, onSelect, id }: {
  openingHours: string
  selected: string
  id: string
  onSelect: (time: string) => void
}) {
  const hours = serviceTimeChoices(openingHours, selected)
  const [hour, setHour] = useState(selected.slice(0, 2) || '19')
  const [minute, setMinute] = useState(selected.slice(3) || '00')
  const currentHour = hours.find((option) => option.hour === hour) ?? hours[0]
  const currentMinute = currentHour?.minutes.includes(minute) ? minute : currentHour?.minutes[0]

  return (
    <section id={id} className="booking-picker" aria-label="Chọn giờ mong muốn">
      {currentHour ? (
        <>
          <div className="booking-time-group" role="group" aria-label="Giờ">
            <b>Giờ</b>
            <div className="booking-hours">
              {hours.map((option) => (
                <button type="button" key={option.hour} className="booking-picker-choice" aria-label={`${option.hour} giờ${option.minutes[0] === '00' ? '' : ' ' + option.minutes[0] + ' phút'}`}
                  aria-pressed={currentHour.hour === option.hour} onClick={() => setHour(option.hour)}>
                  {option.hour}:{option.minutes[0]}
                </button>
              ))}
            </div>
          </div>
          <div className="booking-time-group" role="group" aria-label="Phút">
            <b>Phút</b>
            <div className="booking-minutes">
              {currentHour.minutes.map((option) => (
                <button type="button" key={option} className="booking-picker-choice" aria-label={`${option} phút`}
                  aria-pressed={currentMinute === option} onClick={() => setMinute(option)}>00:{option}</button>
              ))}
            </div>
          </div>
        </>
      ) : <p>Quán chưa công bố giờ mở cửa. Bạn vẫn có thể kiểm tra các khung giờ đặt bàn.</p>}
      {currentHour && currentMinute !== undefined && (
        <div className="booking-picker-actions">
          <button type="button" className="primary-button small" onClick={() => onSelect(`${currentHour.hour}:${currentMinute}`)}>Áp dụng giờ</button>
        </div>
      )}
    </section>
  )
}

export default function BookingCriteriaFields({ date, today, openingHours, preferredTime, guests, capacity, onDate, onTime, onGuests }: {
  date: string
  today: string
  openingHours: string
  preferredTime: string
  guests: string
  capacity: number
  onDate: (date: string) => void
  onTime: (time: string) => void
  onGuests: (guests: string) => void
}) {
  const [picker, setPicker] = useState<'date' | 'time' | null>(null)
  const dateButton = useRef<HTMLButtonElement>(null)
  const timeButton = useRef<HTMLButtonElement>(null)
  const inputId = useId()
  const datePanel = useId()
  const timePanel = useId()
  const guestCount = Number(guests)
  const displayDate = date === today ? `Hôm nay, ${bookingDateLabel(date)}` : bookingDateLabel(date)

  function changeGuests(delta: number) {
    const current = Number.isInteger(guestCount) ? guestCount : 1
    onGuests(String(Math.min(capacity, Math.max(1, current + delta))))
  }

  return (
    <div className="booking-criteria-fields" data-picker={picker ?? undefined}>
      <button className="booking-choice-card" type="button" ref={dateButton} aria-expanded={picker === 'date'}
        aria-controls={picker === 'date' ? datePanel : undefined} onClick={() => setPicker(picker === 'date' ? null : 'date')}>
        <span>Ngày đến</span><b>{displayDate}</b><span className="booking-choice-arrow" aria-hidden="true">›</span>
      </button>
      <button className="booking-choice-card" type="button" ref={timeButton} aria-expanded={picker === 'time'}
        aria-controls={picker === 'time' ? timePanel : undefined} onClick={() => setPicker(picker === 'time' ? null : 'time')}>
        <span>Giờ mong muốn (tùy chọn)</span><b>{preferredTime || 'Chọn giờ'}</b><span className="booking-choice-arrow" aria-hidden="true">›</span>
      </button>
      {picker === 'date' && (
        <DateChoices id={datePanel} selected={date} today={today} onSelect={(selection) => {
          onDate(selection)
          setPicker(null)
          dateButton.current?.focus()
        }} />
      )}
      {picker === 'time' && (
        <TimeChoices id={timePanel} openingHours={openingHours} selected={preferredTime} onSelect={(selection) => {
          onTime(selection)
          setPicker(null)
          timeButton.current?.focus()
        }} />
      )}
      <div className="booking-party">
        <label htmlFor={inputId}>Số khách</label>
        <div className="booking-party-stepper">
          <button type="button" className="booking-icon-button" disabled={guestCount <= 1} aria-label="Giảm số khách" onClick={() => changeGuests(-1)}>−</button>
          <input id={inputId} type="number" required min="1" max={capacity} value={guests} onChange={(event) => onGuests(event.target.value)} />
          <button type="button" className="booking-icon-button" disabled={guestCount >= capacity} aria-label="Tăng số khách" onClick={() => changeGuests(1)}>+</button>
        </div>
      </div>
    </div>
  )
}

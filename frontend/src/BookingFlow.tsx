import { useState } from 'react'
import type { ComponentProps } from 'react'
import BookingModal from './BookingModal'
import type { BookingCriteria } from './BookingModal'
import type { DemoLocation } from './branchBookingDemo'
import ReservationDialog from './ReservationDialog'
import type { BookingLocation } from './reservationApi'

type BookingFlowProps = Omit<ComponentProps<typeof BookingModal>, 'venue' | 'demoSlots' | 'onFindOther' | 'onChangeBranch'> & {
  venue: BookingLocation
  demoLocations?: readonly DemoLocation[]
  onFindOther: (criteria: BookingCriteria, venueId: string) => void
}

export default function BookingFlow({ venue, demoLocations, initialCriteria, onFindOther, ...props }: BookingFlowProps) {
  const [selected, setSelected] = useState<BookingLocation | null>(() => demoLocations ? null : venue)
  const [criteria, setCriteria] = useState(initialCriteria)

  if (selected) {
    return (
      <BookingModal
        {...props}
        key={selected.id}
        venue={selected}
        initialCriteria={criteria}
        demoSlots={demoLocations?.find((location) => location.id === selected.id)?.slots}
        onFindOther={(nextCriteria) => onFindOther(nextCriteria, selected.id)}
        onChangeBranch={demoLocations ? (nextCriteria) => {
          setCriteria(nextCriteria)
          setSelected(null)
        } : undefined}
      />
    )
  }

  return (
    <ReservationDialog label="Chọn địa điểm đặt bàn" className="feature-modal compact-modal" onClose={props.onClose}>
      <header className="feature-modal-header">
        <h2>Chọn chi nhánh</h2>
        <p>Dữ liệu mô phỏng để thử luồng chọn chi nhánh.</p>
      </header>
      <div className="feature-modal-body booking-locations">
        <ul>
          {demoLocations?.map((location) => (
            <li key={location.id}>
              <button type="button" onClick={() => setSelected(location)}>
                <b>{location.name}</b>
                <span>{location.address || location.area}</span>
                <span>{location.hours}</span>
                <span className="booking-location-arrow" aria-hidden="true">›</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </ReservationDialog>
  )
}

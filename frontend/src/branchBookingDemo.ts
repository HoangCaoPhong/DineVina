import type { AvailabilitySlot, BookingLocation } from './reservationApi'

export type DemoLocation = BookingLocation & { slots: AvailabilitySlot[] }

export const demoLocations: readonly [DemoLocation, DemoLocation] = [
  {
    id: 'ui-demo-quan-1',
    name: 'Bếp DineVina Demo — Quận 1',
    area: 'Quận 1',
    address: 'Địa điểm giả lập, Quận 1',
    image: '',
    hours: '10:00 - 22:00',
    maxCapacity: 36,
    slots: [
      { time: '18:30', status: 'Available', is_blocked: false },
      { time: '19:00', status: 'Sold out', is_blocked: false },
      { time: '19:30', status: 'Available', is_blocked: false },
    ],
  },
  {
    id: 'ui-demo-quan-3',
    name: 'Bếp DineVina Demo — Quận 3',
    area: 'Quận 3',
    address: 'Địa điểm giả lập, Quận 3',
    image: '',
    hours: '11:30 - 21:00',
    maxCapacity: 24,
    slots: [
      { time: '18:30', status: 'Sold out', is_blocked: false },
      { time: '19:00', status: 'Available', is_blocked: false },
      { time: '19:30', status: 'Available', is_blocked: false },
    ],
  },
]

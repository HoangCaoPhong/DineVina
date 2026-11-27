import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export default function ReservationDialog({ children, label, className, visible = true, busy = false, onClose }: {
  children: ReactNode
  label: string
  className: string
  visible?: boolean
  busy?: boolean
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const element = dialog.current
    if (!element || !visible) return
    element.showModal()
    return () => element.close()
  }, [visible])

  return (
    <dialog
      ref={dialog}
      className={`reservation-dialog ${className}`}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault()
        if (!busy) onClose()
      }}
    >
      <button type="button" className="modal-close" onClick={onClose} disabled={busy} aria-label="Đóng">×</button>
      {children}
    </dialog>
  )
}

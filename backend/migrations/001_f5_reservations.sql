-- PA4 Functional Group F5: Table Reservation Requests & Status History Migration
-- Non-destructive, idempotent PostgreSQL / Supabase SQL migration.
-- Preserves existing PA2/PA3 rows in public.venues and public.reservations.

ALTER TABLE public.reservations
    ADD COLUMN IF NOT EXISTS reservation_code VARCHAR(24),
    ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(128),
    ADD COLUMN IF NOT EXISTS response_deadline TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS cancellation_deadline TIMESTAMPTZ;

-- Backfill missing deadlines/codes safely for legacy PA2 reservation rows.
UPDATE public.reservations
SET
    reservation_code = COALESCE(
        reservation_code,
        'DV-' || UPPER(SUBSTRING(MD5(id) FROM 1 FOR 6))
    ),
    response_deadline = COALESCE(
        response_deadline,
        created_at + INTERVAL '30 minutes',
        NOW() + INTERVAL '30 minutes'
    ),
    cancellation_deadline = COALESCE(
        cancellation_deadline,
        created_at + INTERVAL '2 hours',
        NOW() + INTERVAL '2 hours'
    )
WHERE
    reservation_code IS NULL
    OR response_deadline IS NULL
    OR cancellation_deadline IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_reservations_code
    ON public.reservations (reservation_code)
    WHERE reservation_code IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_customer_idempotency
    ON public.reservations (customer_id, idempotency_key)
    WHERE customer_id IS NOT NULL AND idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS ix_res_slot_lookup
    ON public.reservations (venue_id, reserved_date, reserved_time, status);

CREATE TABLE IF NOT EXISTS public.reservation_status_history (
    id VARCHAR(64) PRIMARY KEY,
    reservation_id VARCHAR(64) NOT NULL
        REFERENCES public.reservations(id) ON DELETE CASCADE,
    from_state VARCHAR(32),
    to_state VARCHAR(32) NOT NULL,
    actor_id VARCHAR(64) NOT NULL,
    actor_role VARCHAR(32) NOT NULL,
    reason TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_res_status_history_res_id
    ON public.reservation_status_history (reservation_id);

CREATE INDEX IF NOT EXISTS ix_res_status_history_created_at
    ON public.reservation_status_history (created_at);

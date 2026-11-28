-- PA4 Functional Group F7: Availability & Partner Dashboard Migration
-- Idempotent PostgreSQL migration aligned with backend/app/models.py.

CREATE TABLE IF NOT EXISTS public.venue_availability_settings (
    venue_id VARCHAR(64) PRIMARY KEY
        REFERENCES public.venues(id) ON DELETE CASCADE,
    default_slot_capacity INTEGER NOT NULL,
    slot_granularity_minutes INTEGER NOT NULL DEFAULT 30,
    revision INTEGER NOT NULL DEFAULT 1,
    updated_by VARCHAR(64) NOT NULL DEFAULT 'system',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ck_f7_slot_capacity_positive CHECK (default_slot_capacity > 0),
    CONSTRAINT ck_f7_slot_granularity CHECK (slot_granularity_minutes = 30)
);

CREATE TABLE IF NOT EXISTS public.venue_operating_hours (
    id VARCHAR(64) PRIMARY KEY,
    venue_id VARCHAR(64) NOT NULL
        REFERENCES public.venue_availability_settings(venue_id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_operating_hours_day UNIQUE (venue_id, day_of_week),
    CONSTRAINT ck_operating_day_range CHECK (day_of_week BETWEEN 0 AND 6)
);

CREATE INDEX IF NOT EXISTS ix_operating_hours_venue_day
    ON public.venue_operating_hours (venue_id, day_of_week);

CREATE TABLE IF NOT EXISTS public.venue_blocked_slots (
    id VARCHAR(64) PRIMARY KEY,
    venue_id VARCHAR(64) NOT NULL
        REFERENCES public.venue_availability_settings(venue_id) ON DELETE CASCADE,
    blocked_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Active',
    created_by VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cancelled_by VARCHAR(64),
    cancelled_at TIMESTAMPTZ,
    CONSTRAINT ck_blocked_time_range CHECK (start_time < end_time),
    CONSTRAINT ck_blocked_status CHECK (status IN ('Active', 'Cancelled'))
);

CREATE INDEX IF NOT EXISTS ix_blocked_slots_lookup
    ON public.venue_blocked_slots (venue_id, blocked_date, status);

-- F5-compatible read model used by F7 for capacity and dashboard queues.
-- If the F5 migration has already created this table, these statements are no-ops.
CREATE TABLE IF NOT EXISTS public.reservations (
    id VARCHAR(64) PRIMARY KEY,
    reservation_code VARCHAR(24) NOT NULL,
    venue_id VARCHAR(64) NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    customer_id VARCHAR(64) NOT NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    reserved_date VARCHAR(10) NOT NULL,
    reserved_time VARCHAR(5) NOT NULL,
    party_size INTEGER NOT NULL,
    special_requests TEXT NOT NULL DEFAULT '',
    status VARCHAR(32) NOT NULL,
    idempotency_key VARCHAR(128),
    response_deadline TIMESTAMPTZ NOT NULL,
    cancellation_deadline TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_reservations_code UNIQUE (reservation_code),
    CONSTRAINT uq_customer_idempotency UNIQUE (customer_id, idempotency_key)
);

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
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_res_status_history_res_id
    ON public.reservation_status_history (reservation_id);
CREATE INDEX IF NOT EXISTS ix_res_status_history_created_at
    ON public.reservation_status_history (created_at);

CREATE TABLE IF NOT EXISTS public.event_inquiries (
    id VARCHAR(64) PRIMARY KEY,
    inquiry_code VARCHAR(24) NOT NULL UNIQUE,
    venue_id VARCHAR(64) NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    customer_id VARCHAR(64) NOT NULL,
    customer_name VARCHAR(120) NOT NULL,
    customer_phone VARCHAR(32) NOT NULL,
    occasion VARCHAR(160) NOT NULL,
    preferred_date VARCHAR(10) NOT NULL,
    party_size INTEGER NOT NULL,
    budget_min_vnd INTEGER NOT NULL DEFAULT 0,
    budget_max_vnd INTEGER NOT NULL DEFAULT 0,
    special_needs TEXT NOT NULL DEFAULT '',
    status VARCHAR(40) NOT NULL,
    last_message_preview VARCHAR(300) NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_event_inquiries_dashboard
    ON public.event_inquiries (venue_id, status, preferred_date);

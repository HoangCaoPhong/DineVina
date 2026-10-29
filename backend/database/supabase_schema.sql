-- =============================================================================
-- DineVina - Supabase PostgreSQL Database Schema
-- =============================================================================

-- 1. Profiles table (linked to auth.users if Supabase Auth is enabled)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'partner', 'admin')),
    role_label TEXT DEFAULT 'Thực khách',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Venues (Restaurants) table
CREATE TABLE IF NOT EXISTS public.venues (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    description TEXT,
    cuisine TEXT NOT NULL,
    address TEXT NOT NULL,
    district TEXT NOT NULL,
    city TEXT NOT NULL DEFAULT 'Hồ Chí Minh',
    phone TEXT NOT NULL,
    price_range TEXT NOT NULL,
    min_spend INT DEFAULT 0,
    max_spend INT DEFAULT 0,
    rating NUMERIC(2, 1) DEFAULT 5.0,
    total_reviews INT DEFAULT 0,
    cover_image TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    features JSONB DEFAULT '[]'::jsonb,
    available_slots JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Menu Categories table
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id TEXT PRIMARY KEY,
    venue_id TEXT NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Dishes table
CREATE TABLE IF NOT EXISTS public.dishes (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL REFERENCES public.menu_categories(id) ON DELETE CASCADE,
    venue_id TEXT NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_popular BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Reservations table (State Machine)
CREATE TABLE IF NOT EXISTS public.reservations (
    id TEXT PRIMARY KEY,
    venue_id TEXT NOT NULL REFERENCES public.venues(id) ON DELETE RESTRICT,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    reserved_date DATE NOT NULL,
    reserved_time TEXT NOT NULL,
    party_size INT NOT NULL CHECK (party_size > 0),
    status TEXT NOT NULL DEFAULT 'PendingConfirmation' CHECK (
        status IN (
            'PendingConfirmation',
            'Confirmed',
            'Declined',
            'Cancelled',
            'Completed',
            'NoShow',
            'Expired'
        )
    ),
    special_requests TEXT,
    cancellation_reason TEXT,
    confirmed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Event Bookings table
CREATE TABLE IF NOT EXISTS public.event_bookings (
    id TEXT PRIMARY KEY,
    venue_id TEXT NOT NULL REFERENCES public.venues(id) ON DELETE RESTRICT,
    venue_name TEXT NOT NULL,
    customer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    occasion TEXT NOT NULL,
    headcount INT NOT NULL,
    event_date DATE NOT NULL,
    event_time TEXT NOT NULL,
    budget_range TEXT,
    special_needs TEXT,
    status TEXT NOT NULL DEFAULT 'ProposalSent',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Event Messages table (Discussion thread between partner and customer)
CREATE TABLE IF NOT EXISTS public.event_messages (
    id TEXT PRIMARY KEY,
    event_id TEXT NOT NULL REFERENCES public.event_bookings(id) ON DELETE CASCADE,
    sender_role TEXT NOT NULL CHECK (sender_role IN ('customer', 'partner', 'admin')),
    sender_name TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    venue_id TEXT NOT NULL REFERENCES public.venues(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_venues_district ON public.venues(district);
CREATE INDEX IF NOT EXISTS idx_venues_cuisine ON public.venues(cuisine);
CREATE INDEX IF NOT EXISTS idx_reservations_venue_date ON public.reservations(venue_id, reserved_date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON public.reservations(status);

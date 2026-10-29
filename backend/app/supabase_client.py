import os
from typing import Optional
from supabase import create_client, Client

SUPABASE_URL: Optional[str] = os.getenv("SUPABASE_URL")
SUPABASE_KEY: Optional[str] = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_KEY")

_supabase_client: Optional[Client] = None

def get_supabase_client() -> Optional[Client]:
    """
    Returns an initialized Supabase client if credentials are configured in environment.
    Returns None if operating in offline/in-memory simulation mode.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if SUPABASE_URL and SUPABASE_KEY:
        try:
            _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
            return _supabase_client
        except Exception as e:
            print(f"[Supabase] Failed to initialize client: {e}")
            return None
    return None

def is_supabase_enabled() -> bool:
    """Returns True if Supabase credentials are configured and valid."""
    return get_supabase_client() is not None

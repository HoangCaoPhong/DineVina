import os
from typing import Optional
from dotenv import load_dotenv, find_dotenv
from supabase import create_client, Client

# Automatically find and load .env from root or current directory
load_dotenv(find_dotenv())

def get_supabase_client() -> Optional[Client]:
    """
    Returns an initialized Supabase client if credentials are configured in environment.
    Returns None if operating in offline/in-memory simulation mode.
    """
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_ANON_KEY") or os.getenv("SUPABASE_KEY")

    if not supabase_url or not supabase_key:
        return None

    try:
        return create_client(supabase_url, supabase_key)
    except Exception as e:
        print(f"[Supabase] Failed to initialize client: {e}")
        return None

def is_supabase_enabled() -> bool:
    """Returns True if Supabase credentials are configured and valid."""
    return get_supabase_client() is not None

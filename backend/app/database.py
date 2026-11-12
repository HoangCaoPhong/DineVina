import os
from collections.abc import Generator
from sqlalchemy import create_engine, Engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

DEFAULT_SQLITE_URL = "sqlite:///./dinevina_f3.db"


def get_database_url() -> str:
    url = os.getenv("DATABASE_URL", DEFAULT_SQLITE_URL).strip()
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)
    return url


def build_engine(db_url: str | None = None) -> Engine:
    target_url = db_url or get_database_url()
    if target_url.startswith("sqlite"):
        return create_engine(
            target_url,
            connect_args={"check_same_thread": False},
            future=True,
        )
    return create_engine(
        target_url,
        pool_pre_ping=True,
        future=True,
    )


engine = build_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)
Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

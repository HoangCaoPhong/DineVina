from datetime import date, datetime, time

from sqlalchemy import (
    JSON,
    Boolean,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    Time,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class VenueModel(Base):
    __tablename__ = "venues"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(220), unique=True, nullable=False, index=True)
    tagline: Mapped[str] = mapped_column(String(300), nullable=False, default="")
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    address: Mapped[str] = mapped_column(String(300), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    city: Mapped[str] = mapped_column(String(100), nullable=False, default="TP. Hồ Chí Minh")
    cuisine: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    price_range: Mapped[str] = mapped_column(String(120), nullable=False)
    min_budget_vnd: Mapped[int] = mapped_column(Integer, nullable=False, index=True, default=0)
    max_budget_vnd: Mapped[int] = mapped_column(Integer, nullable=False, index=True, default=0)
    max_capacity: Mapped[int] = mapped_column(Integer, nullable=False, index=True, default=20)
    rating: Mapped[float] = mapped_column(Float, nullable=False, default=4.5)
    review_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    cover_image: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    gallery_images: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    amenities: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    opening_hours: Mapped[str] = mapped_column(String(120), nullable=False, default="10:00 - 22:00")
    contact_phone: Mapped[str] = mapped_column(String(40), nullable=False, default="")
    cancellation_policy: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
        default="Hủy miễn phí trước giờ hẹn ít nhất 2 tiếng.",
    )
    available_slots: Mapped[list[dict]] = mapped_column(JSON, nullable=False, default=list)
    status: Mapped[str] = mapped_column(String(40), nullable=False, index=True, default="pending")
    is_sample: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    sample_label: Mapped[str] = mapped_column(
        String(160),
        nullable=False,
        default="Sample Data — PA3 Validated Fixture",
    )

    dishes: Mapped[list["DishModel"]] = relationship(
        "DishModel",
        back_populates="venue",
        cascade="all, delete-orphan",
        order_by="DishModel.id",
    )


class DishModel(Base):
    __tablename__ = "dishes"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    venue_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    category_name: Mapped[str] = mapped_column(String(120), nullable=False, default="Món chính")
    name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    price_vnd: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False, default="")
    dietary_tags: Mapped[list[str]] = mapped_column(JSON, nullable=False, default=list)
    is_signature: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    is_available: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    venue: Mapped["VenueModel"] = relationship("VenueModel", back_populates="dishes")

class VenueAvailabilitySettingsModel(Base):
    __tablename__ = "venue_availability_settings"

    venue_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("venues.id", ondelete="CASCADE"),
        primary_key=True,
    )
    default_slot_capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    slot_granularity_minutes: Mapped[int] = mapped_column(
        Integer, nullable=False, default=30
    )
    revision: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    updated_by: Mapped[str] = mapped_column(String(64), nullable=False, default="system")
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )

    venue: Mapped["VenueModel"] = relationship("VenueModel")
    operating_hours: Mapped[list["VenueOperatingHoursModel"]] = relationship(
        "VenueOperatingHoursModel",
        back_populates="settings",
        cascade="all, delete-orphan",
        order_by="VenueOperatingHoursModel.day_of_week",
    )
    blocked_slots: Mapped[list["VenueBlockedSlotModel"]] = relationship(
        "VenueBlockedSlotModel",
        back_populates="settings",
        cascade="all, delete-orphan",
        order_by="VenueBlockedSlotModel.blocked_date",
    )


class VenueOperatingHoursModel(Base):
    __tablename__ = "venue_operating_hours"
    __table_args__ = (
        UniqueConstraint("venue_id", "day_of_week", name="uq_operating_hours_day"),
        Index("ix_operating_hours_venue_day", "venue_id", "day_of_week"),
    )

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    venue_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("venue_availability_settings.venue_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    day_of_week: Mapped[int] = mapped_column(Integer, nullable=False)
    open_time: Mapped[time] = mapped_column(Time, nullable=False)
    close_time: Mapped[time] = mapped_column(Time, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )

    settings: Mapped["VenueAvailabilitySettingsModel"] = relationship(
        "VenueAvailabilitySettingsModel", back_populates="operating_hours"
    )


class VenueBlockedSlotModel(Base):
    __tablename__ = "venue_blocked_slots"
    __table_args__ = (
        Index("ix_blocked_slots_lookup", "venue_id", "blocked_date", "status"),
    )

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    venue_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("venue_availability_settings.venue_id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    blocked_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="Active")
    created_by: Mapped[str] = mapped_column(String(64), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, default=datetime.utcnow
    )
    cancelled_by: Mapped[str | None] = mapped_column(String(64), nullable=True)
    cancelled_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    settings: Mapped["VenueAvailabilitySettingsModel"] = relationship(
        "VenueAvailabilitySettingsModel", back_populates="blocked_slots"
    )


class ReservationModel(Base):
    __tablename__ = "reservations"
    __table_args__ = (
        Index(
            "ix_res_slot_lookup",
            "venue_id",
            "reserved_date",
            "reserved_time",
            "status",
        ),
        UniqueConstraint(
            "customer_id",
            "idempotency_key",
            name="uq_customer_idempotency",
        ),
    )

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    reservation_code: Mapped[str] = mapped_column(
        String(24), unique=True, nullable=False, index=True
    )
    venue_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    customer_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    customer_name: Mapped[str] = mapped_column(String(120), nullable=False)
    customer_phone: Mapped[str] = mapped_column(String(32), nullable=False)
    reserved_date: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    reserved_time: Mapped[str] = mapped_column(String(5), nullable=False, index=True)
    party_size: Mapped[int] = mapped_column(Integer, nullable=False)
    special_requests: Mapped[str] = mapped_column(Text, nullable=False, default="")
    status: Mapped[str] = mapped_column(String(32), nullable=False, index=True)
    idempotency_key: Mapped[str | None] = mapped_column(String(128), nullable=True)
    response_deadline: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    cancellation_deadline: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )

    venue: Mapped["VenueModel"] = relationship("VenueModel")
    status_history: Mapped[list["ReservationStatusHistoryModel"]] = relationship(
        "ReservationStatusHistoryModel",
        back_populates="reservation",
        cascade="all, delete-orphan",
        order_by="ReservationStatusHistoryModel.created_at",
    )


class ReservationStatusHistoryModel(Base):
    __tablename__ = "reservation_status_history"

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    reservation_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("reservations.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    from_state: Mapped[str | None] = mapped_column(String(32), nullable=True)
    to_state: Mapped[str] = mapped_column(String(32), nullable=False)
    actor_id: Mapped[str] = mapped_column(String(64), nullable=False)
    actor_role: Mapped[str] = mapped_column(String(32), nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False, default="")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )

    reservation: Mapped["ReservationModel"] = relationship(
        "ReservationModel", back_populates="status_history"
    )


class EventInquiryModel(Base):
    __tablename__ = "event_inquiries"
    __table_args__ = (
        Index("ix_event_inquiries_dashboard", "venue_id", "status", "preferred_date"),
    )

    id: Mapped[str] = mapped_column(String(64), primary_key=True, index=True)
    inquiry_code: Mapped[str] = mapped_column(
        String(24), unique=True, nullable=False, index=True
    )
    venue_id: Mapped[str] = mapped_column(
        String(64),
        ForeignKey("venues.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    customer_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    customer_name: Mapped[str] = mapped_column(String(120), nullable=False)
    customer_phone: Mapped[str] = mapped_column(String(32), nullable=False)
    occasion: Mapped[str] = mapped_column(String(160), nullable=False)
    preferred_date: Mapped[str] = mapped_column(String(10), nullable=False, index=True)
    party_size: Mapped[int] = mapped_column(Integer, nullable=False)
    budget_min_vnd: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    budget_max_vnd: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    special_needs: Mapped[str] = mapped_column(Text, nullable=False, default="")
    status: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    last_message_preview: Mapped[str] = mapped_column(
        String(300), nullable=False, default=""
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )

    venue: Mapped["VenueModel"] = relationship("VenueModel")


from sqlalchemy import JSON, Boolean, Float, ForeignKey, Integer, String, Text
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

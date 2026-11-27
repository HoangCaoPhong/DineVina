from dataclasses import dataclass

from fastapi import Depends, Header, HTTPException


@dataclass(frozen=True)
class ActorContext:
    user_id: str
    role: str
    owned_venue_ids: frozenset[str]


VALID_ROLES = frozenset({"customer", "partner_staff", "administrator"})


def _parse_owned_venues(raw_venues: str | None) -> frozenset[str]:
    if not raw_venues:
        return frozenset()
    return frozenset(v.strip() for v in raw_venues.split(",") if v.strip())


def get_current_actor(
    x_user_id: str | None = Header(default=None, alias="X-User-Id"),
    x_user_role: str | None = Header(default=None, alias="X-User-Role"),
    x_partner_venues: str | None = Header(default=None, alias="X-Partner-Venues"),
) -> ActorContext:
    if not x_user_id or not x_user_id.strip() or not x_user_role:
        raise HTTPException(
            status_code=401,
            detail={
                "code": "AUTH_REQUIRED",
                "message": "Authentication headers (X-User-Id, X-User-Role) required.",
            },
        )

    role = x_user_role.strip()
    if role not in VALID_ROLES:
        raise HTTPException(
            status_code=403,
            detail={"code": "INVALID_ROLE", "message": f"Unsupported actor role: {role}."},
        )

    return ActorContext(
        user_id=x_user_id.strip(),
        role=role,
        owned_venue_ids=_parse_owned_venues(x_partner_venues),
    )


_ACTOR_DEPENDENCY = Depends(get_current_actor)


def require_roles(*allowed_roles: str):
    allowed = frozenset(allowed_roles)

    def _checker(actor: ActorContext = _ACTOR_DEPENDENCY) -> ActorContext:
        if actor.role not in allowed:
            raise HTTPException(
                status_code=403,
                detail={
                    "code": "FORBIDDEN_ROLE",
                    "message": "You do not have permission to perform this action.",
                },
            )
        return actor

    return _checker

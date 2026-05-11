# auditlog/services.py
from __future__ import annotations
from typing import Any, Optional
from .models import AuditLog

def registerLog(
    action: str,
    message: str,
    *,
    resource: str,
    user_id: Optional[str] = None,
    origin: Optional[str] = None,
    actor=None,
    beforeData: Optional[dict[str, Any]] = None,
    afterData: Optional[dict[str, Any]] = None,
) -> AuditLog:
    action_norm = (action or "CUSTOM").strip().upper()

    return AuditLog.objects.create(
        action=action_norm,
        resource=resource,
        user_id=str(user_id) if user_id is not None else None,
        message=message,
        beforeData=beforeData or {},
        afterData=afterData or {},
        origin=origin,

        created_by=actor if actor is not None else None,
        updated_by=actor if actor is not None else None,
        is_active=True,
    )

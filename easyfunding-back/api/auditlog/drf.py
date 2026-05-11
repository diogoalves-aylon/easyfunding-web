# auditlog/drf.py
from __future__ import annotations

from typing import Any, Iterable, Optional
from django.forms.models import model_to_dict
from rest_framework.request import Request
from datetime import date, datetime, time
from decimal import Decimal
from uuid import UUID
from django.forms.models import model_to_dict
from .services import registerLog


def _json_safe(value: Any) -> Any:
    """Converte tipos não-JSON para algo serializável."""
    if value is None:
        return None
    if isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, (datetime, date, time)):
        return value.isoformat()
    if isinstance(value, (UUID, Decimal)):
        return str(value)
    if isinstance(value, dict):
        return {str(k): _json_safe(v) for k, v in value.items()}
    if isinstance(value, (list, tuple, set)):
        return [_json_safe(v) for v in value]
    # fallback: string
    return str(value)

def _make_json_safe_dict(data: dict[str, Any]) -> dict[str, Any]:
    return {k: _json_safe(v) for k, v in data.items()}


DEFAULT_EXCLUDE_FIELDS = {
    "password",
    "last_login",
    "is_superuser",
    "is_staff",
    "user_permissions",
    "groups",
}

def _safe_model_snapshot(
    instance,
    *,
    exclude: Optional[set[str]] = None,
    include: Optional[set[str]] = None,
) -> dict[str, Any]:
    data = model_to_dict(instance)

    if include:
        data = {k: data.get(k) for k in include if k in data}
    else:
        to_exclude = set(DEFAULT_EXCLUDE_FIELDS)
        if exclude:
            to_exclude |= set(exclude)
        for k in list(data.keys()):
            if k in to_exclude:
                data.pop(k, None)

    # 🔥 aqui está a correção
    return _make_json_safe_dict(data)

class AuditLogMixin:
    """
    Mixin para ViewSets DRF:
    - Loga CREATE/UPDATE/DELETE automaticamente
    - Captura beforeData/afterData sem você passar manualmente
    """

    auditlog_resource: str | None = None
    auditlog_exclude_fields: set[str] = {"password"}  # ajuste conforme necessidade
    auditlog_origin_header: str = "HTTP_X_CLIENT_ORIGIN"  # opcional
    auditlog_include_fields: set[str] | None = None

    def _audit_resource(self) -> str:
        if self.auditlog_resource:
            return self.auditlog_resource
        # fallback: usa nome do model
        qs = getattr(self, "queryset", None)
        if qs is not None:
            return qs.model._meta.db_table
        return self.__class__.__name__

    def _audit_origin(self, request: Request) -> str:
        return request.META.get(self.auditlog_origin_header) or "WEB"

    def perform_create(self, serializer):
        request: Request = self.request

        # injeta auditoria se o model tiver esses campos
        save_kwargs = {}
        if hasattr(serializer.Meta.model, "created_by"):
            save_kwargs["created_by"] = request.user if request.user.is_authenticated else None
        if hasattr(serializer.Meta.model, "updated_by"):
            save_kwargs["updated_by"] = request.user if request.user.is_authenticated else None

        serializer.save(**save_kwargs)

        instance = serializer.instance
        after_data = _safe_model_snapshot(
            instance,
            exclude=self.auditlog_exclude_fields,
            include=self.auditlog_include_fields,
        )

        registerLog(
            "CREATE",
            f"Created {self._audit_resource()}",
            resource=self._audit_resource(),
            user_id=str(getattr(instance, "id", "")) or None,
            origin=self._audit_origin(request),
            actor=getattr(request, "user", None),
            afterData=after_data,
        )

    def perform_update(self, serializer):
        request: Request = self.request

        instance_before = self.get_queryset().get(pk=self.get_object().pk)
        before_data = _safe_model_snapshot(
            instance_before,
            exclude=self.auditlog_exclude_fields,
            include=self.auditlog_include_fields,
        )

        save_kwargs = {}
        # injeta updated_by automaticamente
        if hasattr(serializer.Meta.model, "updated_by"):
            save_kwargs["updated_by"] = request.user if request.user.is_authenticated else None

        serializer.save(**save_kwargs)

        instance_after = serializer.instance
        after_data = _safe_model_snapshot(
            instance_after,
            exclude=self.auditlog_exclude_fields,
            include=self.auditlog_include_fields,
        )

        registerLog(
            "UPDATE",
            f"Updated {self._audit_resource()}",
            resource=self._audit_resource(),
            user_id=str(getattr(instance_after, "id", "")) or None,
            origin=self._audit_origin(request),
            actor=getattr(request, "user", None),
            beforeData=before_data,
            afterData=after_data,
        )

    def perform_destroy(self, instance):
        request: Request = self.request

        before_data = _safe_model_snapshot(
            instance,
            exclude=self.auditlog_exclude_fields,
            include=self.auditlog_include_fields,
        )
        obj_id = str(getattr(instance, "id", "")) or None

        # suporta isActive e is_active + injeta updatedBy se existir
        if hasattr(instance, "isActive"):
            instance.isActive = False
            if hasattr(instance, "updated_by"):
                instance.updated_by = request.user if request.user.is_authenticated else None
                instance.save(update_fields=["isActive", "updated_by"])
            else:
                instance.save(update_fields=["isActive"])

            action = "SOFT_DELETE"
            msg = f"Deactivated {self._audit_resource()}"
            after_data = _safe_model_snapshot(
                instance,
                exclude=self.auditlog_exclude_fields,
                include=self.auditlog_include_fields,
            )

        elif hasattr(instance, "is_active"):
            instance.is_active = False
            if hasattr(instance, "updated_by"):
                instance.updated_by = request.user if request.user.is_authenticated else None
                instance.save(update_fields=["is_active", "updated_by"])
            else:
                instance.save(update_fields=["is_active"])

            action = "SOFT_DELETE"
            msg = f"Deactivated {self._audit_resource()}"
            after_data = _safe_model_snapshot(
                instance,
                exclude=self.auditlog_exclude_fields,
                include=self.auditlog_include_fields,
            )

        else:
            instance.delete()
            action = "DELETE"
            msg = f"Deleted {self._audit_resource()}"
            after_data = {}

        registerLog(
            action,
            msg,
            resource=self._audit_resource(),
            user_id=obj_id,
            origin=self._audit_origin(request),
            actor=getattr(request, "user", None),
            beforeData=before_data,
            afterData=after_data,
        )



from django.contrib import admin
from .models import AuditLog


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("created_at", "action", "resource", "user_id", "origin", "created_by", "is_active")
    list_filter = ("action", "resource", "origin", "is_active")
    search_fields = ("message", "user_id", "resource", "origin")
    ordering = ("-created_at",)
    readonly_fields = (
        "id",
        "action", "resource", "user_id", "message",
        "beforeData", "afterData", "origin",
        "created_at", "created_by", "updated_at", "updated_by", "is_active",
    )

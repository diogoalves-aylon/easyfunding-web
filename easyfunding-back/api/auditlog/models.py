from django.conf import settings
from django.db import models


class AuditFields(models.Model):
    """
    Abstract model: NÃO cria tabela.
    Só injeta os campos de auditoria em qualquer model que herdar dele.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="%(class)s_created",
    )

    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="%(class)s_updated",
    )

    is_active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class AuditLog(AuditFields):
    class Action(models.TextChoices):
        CREATE = "CREATE"
        UPDATE = "UPDATE"
        DELETE = "DELETE"
        SOFT_DELETE = "SOFT_DELETE"
        RESTORE = "RESTORE"
        CUSTOM = "CUSTOM"

    id = models.BigAutoField(primary_key=True)

    action = models.CharField(max_length=20, choices=Action.choices)
    resource = models.CharField(max_length=120)

    # conforme seu diagrama: string
    user_id = models.CharField(max_length=64, null=True, blank=True)

    message = models.TextField()

    beforeData = models.JSONField(default=dict, blank=True)
    afterData = models.JSONField(default=dict, blank=True)

    origin = models.CharField(max_length=120, null=True, blank=True)

    class Meta:
        db_table = "audit_log"
        indexes = [
            models.Index(fields=["resource", "user_id", "created_at"]),
            models.Index(fields=["action", "created_at"]),
            models.Index(fields=["created_by", "created_at"]),
            models.Index(fields=["origin", "created_at"]),
        ]

    def __str__(self) -> str:
        return f"[{self.action}] {self.resource} user_id={self.user_id or '-'}"

from celery import shared_task
from django.utils import timezone

from .models import Notification, DeviceToken
from .fcm import send_to_tokens


def _is_missing_credentials_error(exc: Exception) -> bool:
    msg = str(exc).lower()
    return (
        "credencial não configurada" in msg or "google_application_credentials" in msg
    )


@shared_task(bind=True, max_retries=3)
def send_notification_task(self, notification_id: int):
    n = Notification.objects.get(id=notification_id)

    tokens = list(
        DeviceToken.objects.filter(user=n.user, is_active=True).values_list(
            "token", flat=True
        )
    )

    if not tokens:
        n.status = "failed"
        n.error_message = "No active tokens for user"
        n.save(update_fields=["status", "error_message"])
        return

    try:
        resp = send_to_tokens(
            tokens=tokens, title=n.title, body=n.body, data=n.data or {}
        )

        success_count = int(resp.get("success_count", 0))
        failure_count = int(resp.get("failure_count", 0))
        failures = resp.get("failures", [])

        if failure_count == len(tokens):
            raise RuntimeError(f"FCM failure: {failures}")

        # Desativar tokens inválidos (falhas individuais)
        for f in failures:
            err = (f.get("error") or "").lower()
            tok = f.get("token")
            if tok and ("not a valid" in err or "not registered" in err or "requested entity was not found" in err):
                DeviceToken.objects.filter(token=tok).update(is_active=False)

        # Se ao menos 1 sucesso, considero "sent"
        if success_count > 0:
            n.status = "sent"
            n.sent_at = timezone.now()
            n.error_message = None
        else:
            n.status = "failed"
            n.error_message = "FCM: all tokens failed"

        n.save(update_fields=["status", "sent_at", "error_message"])

    except Exception as exc:
        # Se faltou credencial, não adianta retry
        n.status = "failed"
        n.error_message = str(exc)
        n.save(update_fields=["status", "error_message"])

        if _is_missing_credentials_error(exc):
            return

        # Erros transitórios: retry
        raise self.retry(exc=exc, countdown=5)

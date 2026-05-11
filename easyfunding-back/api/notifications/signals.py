from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from .realtime import publish_notification_created

@receiver(post_save, sender=Notification)
def notify_on_create(sender, instance: Notification, created: bool, **kwargs):
    if not created:
        return

    payload = {
        "event": "notification.created",
        "notification": {
            "id": instance.id,
            "title": instance.title,
            "body": instance.body,
            "data": instance.data,
            "status": instance.status,
            "created_at": instance.created_at.isoformat() if instance.created_at else None,
            "sent_at": instance.sent_at.isoformat() if instance.sent_at else None,
            "read_at": instance.read_at.isoformat() if instance.read_at else None,
        },
    }
    publish_notification_created(instance.user_id, payload)
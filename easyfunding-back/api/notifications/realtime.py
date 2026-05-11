import json
from django.conf import settings
import redis

def _redis():
    url = settings.NOTIFICATIONS_REDIS_URL
    if not url:
        raise RuntimeError("NOTIFICATIONS_REDIS_URL (ou CELERY_BROKER_URL) não configurado.")
    return redis.Redis.from_url(url, decode_responses=True)

def channel_for_user(user_id: int) -> str:
    return f"{settings.NOTIFICATIONS_REDIS_CHANNEL_PREFIX}{user_id}"

def publish_notification_created(user_id: int, payload: dict):
    r = _redis()
    r.publish(channel_for_user(user_id), json.dumps(payload))
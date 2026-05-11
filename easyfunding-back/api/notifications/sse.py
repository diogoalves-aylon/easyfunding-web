import json
import time
import redis

from django.conf import settings
from django.http import StreamingHttpResponse
from rest_framework_simplejwt.authentication import JWTAuthentication

def _redis_pubsub():
    url = settings.NOTIFICATIONS_REDIS_URL
    r = redis.Redis.from_url(url, decode_responses=True)
    return r.pubsub()

def _sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"

def notifications_stream(request):
    """
    SSE endpoint.
    Auth: token via querystring ?token=ACCESS_TOKEN
    """
    token = request.GET.get("token")
    if not token:
        return StreamingHttpResponse(
            _sse("error", {"detail": "Missing token"}),
            content_type="text/event-stream",
            status=401,
        )

    # Injeta o Authorization para o SimpleJWT autenticar
    request.META["HTTP_AUTHORIZATION"] = f"Bearer {token}"
    auth = JWTAuthentication()
    user_auth = auth.authenticate(request)
    if not user_auth:
        return StreamingHttpResponse(
            _sse("error", {"detail": "Invalid token"}),
            content_type="text/event-stream",
            status=401,
        )
    user, _jwt = user_auth

    channel = f"{settings.NOTIFICATIONS_REDIS_CHANNEL_PREFIX}{user.id}"
    pubsub = _redis_pubsub()
    pubsub.subscribe(channel)

    def gen():
        # ping inicial
        yield _sse("ready", {"ok": True})

        last_ping = time.time()
        try:
            for msg in pubsub.listen():
                if msg is None:
                    continue
                if msg.get("type") != "message":
                    continue

                # heartbeat a cada ~15s (alguns proxies derrubam conexão “silenciosa”)
                now = time.time()
                if now - last_ping > 15:
                    last_ping = now
                    yield ": ping\n\n"

                raw = msg.get("data")
                try:
                    payload = json.loads(raw)
                except Exception:
                    payload = {"event": "notification.created", "raw": raw}

                yield _sse(payload.get("event", "notification.created"), payload)
        finally:
            try:
                pubsub.unsubscribe(channel)
                pubsub.close()
            except Exception:
                pass

    resp = StreamingHttpResponse(gen(), content_type="text/event-stream")
    resp["Cache-Control"] = "no-cache"
    resp["X-Accel-Buffering"] = "no"  # ajuda em nginx (quando tiver)
    return resp
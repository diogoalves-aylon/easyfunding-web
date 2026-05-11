import os
import firebase_admin
from firebase_admin import credentials, messaging

def _init_firebase():
    if firebase_admin._apps:
        return
    cred_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
    if not cred_path:
        raise RuntimeError("GOOGLE_APPLICATION_CREDENTIALS não definido.")
    firebase_admin.initialize_app(credentials.Certificate(cred_path))

def _stringify_data(data: dict | None):
    if not data:
        return {}
    return {str(k): str(v) for k, v in data.items()}

def send_to_tokens(*, tokens: list[str], title: str, body: str, data: dict | None = None):
    """
    Envia push para vários tokens (mesmo user em múltiplos devices).
    Retorna um dict simples com counts e erros.
    """
    _init_firebase()

    tokens = [t for t in tokens if t]
    if not tokens:
        return {"success_count": 0, "failure_count": 0, "errors": ["no_tokens"]}

    multicast = messaging.MulticastMessage(
        tokens=tokens,
        notification=messaging.Notification(title=title, body=body),
        data=_stringify_data(data),
        android=messaging.AndroidConfig(
            priority="high",
            notification=messaging.AndroidNotification(
                channel_id="alerts",
                sound="default",
                visibility="public",
            ),
        ),
        apns=messaging.APNSConfig(
            payload=messaging.APNSPayload(
                aps=messaging.Aps(sound="default")
            )
        ),
    )

    resp = messaging.send_each_for_multicast(multicast)

    failures = []
    for idx, r in enumerate(resp.responses):
        if not r.success:
            failures.append({"index": idx, "token": tokens[idx], "error": str(r.exception)})

    return {
        "success_count": resp.success_count,
        "failure_count": resp.failure_count,
        "failures": failures,
    }
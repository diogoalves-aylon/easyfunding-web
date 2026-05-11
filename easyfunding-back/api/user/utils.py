# user/utils.py
from api.auditlog.drf import _safe_model_snapshot

USER_AUDIT_FIELDS = {
    "id", "username", "first_name", "last_name", "email", "phone",
    "is_active", "is_staff", "date_joined"
}

def snapshot_user(user):
    return _safe_model_snapshot(user, include=USER_AUDIT_FIELDS)

def snapshot_user_with_groups(user):
    data = snapshot_user(user)
    data["groups"] = list(user.groups.values_list("name", flat=True))
    return data

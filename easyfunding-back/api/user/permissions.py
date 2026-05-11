# user/permissions.py
from rest_framework.permissions import BasePermission
from django.contrib.auth.models import Group
from .models import RoutePermission


class HasRoutePermission(BasePermission):
    """
    Permite acesso se:
    - usuário autenticado
    - é staff/superuser (bypass)
    - OU tem 'all'
    - OU tem a permissão inferida a partir do endpoint (users/groups)
    """

    # Mapeia "basename" do router -> permission key que você já usa no front
    # router.register('users', ..., basename='user') => user-list/user-detail
    # router.register('groups', ..., basename='group') => group-list/group-detail
    VIEWSET_PERMISSION_MAP = {
        "user": "admin-users",
        "group": "admin-roles",
    }

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # bypass (opcional)
        if request.user.is_superuser or request.user.is_staff:
            return True

        perms = self._get_user_route_permissions(request.user)

        # admin group também ganha all
        if "all" in perms:
            return True

        needed = self._infer_needed_permission(request, view)

        # Segurança: se não souber o que exigir, NEGAR (evita abrir endpoint novo sem controle)
        if not needed:
            return False

        return needed in perms

    def _get_user_route_permissions(self, user):
        # igual à lógica do seu serializer, só que no backend
        if user.is_staff or user.groups.filter(name="ADMIN").exists():
            return {"all"}

        perms = set()
        for group in user.groups.all():
            for rp in group.route_permissions.all():
                perms.add(rp.route_name)
        return perms

    def _infer_needed_permission(self, request, view):
        # Se a view declarar explicitamente
        explicit = getattr(view, "required_permission", None)
        if explicit:
            return explicit

        # Inferir via view_name do DRF: "user-list", "group-detail", etc.
        match = getattr(request, "resolver_match", None)
        view_name = getattr(match, "view_name", "") or ""
        # view_name normalmente vem como "user-list", "user-detail" se basename="user"
        if "-" in view_name:
            base = view_name.split("-")[0]  # "user" / "group"
            return self.VIEWSET_PERMISSION_MAP.get(base)

        # fallback por basename (se existir)
        basename = getattr(view, "basename", None)
        if basename:
            return self.VIEWSET_PERMISSION_MAP.get(basename)

        return None

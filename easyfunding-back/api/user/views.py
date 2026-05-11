from rest_framework import generics, viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from api.auditlog.drf import AuditLogMixin
from api.auditlog.services import registerLog
from .permissions import HasRoutePermission
from django.contrib.auth.models import Group
from .serializers import UserSerializer, UserDetailSerializer, GroupSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .utils import snapshot_user, snapshot_user_with_groups
from django.shortcuts import get_object_or_404
User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

class UserDetailView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UserDetailSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        before = snapshot_user(request.user)

        serializer = UserDetailSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            after = snapshot_user(request.user)

            registerLog(
                "UPDATE",
                "Updated own profile",
                resource=User._meta.db_table,
                user_id=str(request.user.id),
                origin="WEB",
                actor=request.user,
                beforeData=before,
                afterData=after,
            )
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request):
        request.user.is_active = False
        request.user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)     

class UserViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated, HasRoutePermission)
    
    auditlog_resource = User._meta.db_table
    
    auditlog_include_fields = {
        "id",
        "username",
        "first_name",
        "last_name",
        "email",
        "phone",
        "is_active",
        "date_joined",
    }

    @action(detail=True, methods=['post'])
    def set_role(self, request, pk=None):
        user = self.get_object()
        role_name = request.data.get("role")

        if not role_name:
            return Response({"error": "Role name required"}, status=status.HTTP_400_BAD_REQUEST)

        before = snapshot_user_with_groups(user)

        if role_name == "USER":
            user.groups.clear()
            user.is_staff = False
            user.save()

            after = snapshot_user_with_groups(user)

            registerLog(
                "UPDATE",
                "Role reset to USER",
                resource=user._meta.db_table,
                user_id=str(user.id),
                origin=request.META.get("HTTP_X_CLIENT_ORIGIN") or "WEB",
                actor=request.user,
                beforeData=before,
                afterData=after,
            )
            return Response({"status": "Role reset to USER"})

        try:
            if role_name == "ADMIN":
                group, _ = Group.objects.get_or_create(name="ADMIN")
            else:
                group = Group.objects.get(name=role_name)
        except Group.DoesNotExist:
            return Response({"error": f'Role "{role_name}" not found'}, status=status.HTTP_404_NOT_FOUND)

        user.groups.clear()
        user.groups.add(group)
        user.is_staff = (role_name == "ADMIN")
        user.save()

        after = snapshot_user_with_groups(user)

        registerLog(
            "UPDATE",
            f"Role set to {role_name}",
            resource=user._meta.db_table,
            user_id=str(user.id),
            origin=request.META.get("HTTP_X_CLIENT_ORIGIN") or "WEB",
            actor=request.user,
            beforeData=before,
            afterData=after,
        )

        return Response({"status": f"Role set to {role_name}"})

class GroupViewSet(AuditLogMixin, viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = (IsAuthenticated, HasRoutePermission)

    auditlog_resource = Group._meta.db_table
    auditlog_include_fields = {"id", "name"}
      
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('currentPassword')
        new_password = request.data.get('newPassword')

        if not current_password or not new_password:
            return Response(
                {'detail': 'Senha atual e nova senha são obrigatórias.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(current_password):
            return Response(
                {'detail': 'Senha atual incorreta.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if current_password == new_password:
            return Response(
                {'detail': 'A nova senha deve ser diferente da senha atual.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        
        registerLog(
            "UPDATE",
            "Changed password",
            resource=User._meta.db_table,
            user_id=str(request.user.id),
            origin="WEB",
            actor=request.user,
        )

        return Response(
            {'detail': 'Senha alterada com sucesso.'},
            status=status.HTTP_200_OK
        )

class UserDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        before = snapshot_user(request.user)

        request.user.is_active = False
        request.user.save(update_fields=["is_active"])

        after = snapshot_user(request.user)

        registerLog(
            "SOFT_DELETE",
            "Deactivated own account",
            resource=User._meta.db_table,
            user_id=str(request.user.id),
            origin="WEB",
            actor=request.user,
            beforeData=before,
            afterData=after,
        )
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class AdminEditUserView(APIView):
    permission_classes = (IsAuthenticated, HasRoutePermission)

    def patch(self, request, user_id: int):
        user = get_object_or_404(User, pk=user_id)

        before = snapshot_user(user)

        serializer = UserDetailSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            after = snapshot_user(user)

            registerLog(
                "UPDATE",
                "Edited user",
                resource=User._meta.db_table,
                user_id=str(user.id),
                origin="WEB",
                actor=request.user,      # quem editou (admin)
                beforeData=before,
                afterData=after,
            )

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = get_object_or_404(User, pk=user_id)

        before = snapshot_user(user)

        serializer = UserDetailSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            after = snapshot_user(user)

            registerLog(
                "UPDATE",
                "Edited user",
                resource=User._meta.db_table,
                user_id=str(user.id),
                origin="WEB",
                actor=request.user,
                beforeData=before,
                afterData=after,
            )

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
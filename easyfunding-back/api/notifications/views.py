from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import DeviceToken, Notification
from .serializers import (
    RegisterDeviceSerializer,
    SendNotificationSerializer,
    MarkReadSerializer,
)
from .tasks import send_notification_task


class RegisterDeviceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        s = RegisterDeviceSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        token = s.validated_data["token"]
        platform = s.validated_data["platform"]

        obj, created = DeviceToken.objects.update_or_create(
            token=token,
            defaults={
                "user": request.user,
                "platform": platform,
                "is_active": True,
            },
        )

        return Response(
            {"status": "registered", "created": created, "id": obj.id},
            status=status.HTTP_200_OK,
        )


class SendNotificationView(APIView):
    """
    Endpoint "genérico" do boilerplate para enfileirar envio.
    Por padrão, restrito a admin/staff (ajuste depois conforme seus projetos).
    """
    permission_classes = [IsAuthenticated, IsAdminUser]

    def post(self, request):
        s = SendNotificationSerializer(data=request.data)
        s.is_valid(raise_exception=True)

        user_id = s.validated_data["user_id"]
        title = s.validated_data["title"]
        body = s.validated_data["body"]
        data = s.validated_data.get("data") or {}

        n = Notification.objects.create(
            user_id=user_id,
            title=title,
            body=body,
            data=data,
            status="pending",
        )
        
        data["notification_id"] = str(n.id)
        Notification.objects.filter(id=n.id).update(data=data)

        send_notification_task.delay(n.id)

        return Response(
            {"status": "queued", "notification_id": n.id},
            status=status.HTTP_201_CREATED,
        )


class MyNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # simples; depois podemos paginar
        qs = (
            Notification.objects.filter(user=request.user)
            .order_by("-created_at")
        )

        items = []
        for n in qs[:200]:  # limite básico para não explodir
            items.append(
                {
                    "id": n.id,
                    "title": n.title,
                    "body": n.body,
                    "data": n.data,
                    "status": n.status,
                    "error_message": n.error_message,
                    "created_at": n.created_at,
                    "sent_at": n.sent_at,
                    "read_at": n.read_at,
                }
            )

        return Response({"results": items}, status=status.HTTP_200_OK)


class MarkNotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk: int):
        s = MarkReadSerializer(data=request.data or {})
        s.is_valid(raise_exception=True)

        read = s.validated_data["read"]

        n = Notification.objects.filter(id=pk, user=request.user).first()
        if not n:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        n.read_at = timezone.now() if read else None
        n.save(update_fields=["read_at"])

        return Response({"status": "ok", "read_at": n.read_at}, status=status.HTTP_200_OK)


class DeleteNotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk: int):
        n = Notification.objects.filter(id=pk, user=request.user).first()
        if not n:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        n.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ClearNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        Notification.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

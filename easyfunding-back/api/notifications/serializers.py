from rest_framework import serializers


class RegisterDeviceSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255)
    platform = serializers.ChoiceField(choices=["android", "ios"])


class SendNotificationSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    title = serializers.CharField(max_length=255)
    body = serializers.CharField()
    data = serializers.JSONField(required=False)


class MarkReadSerializer(serializers.Serializer):
    # opcional: permitir marcar lida/desmarcar
    read = serializers.BooleanField(default=True)

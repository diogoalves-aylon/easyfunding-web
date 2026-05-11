from rest_framework import serializers
from .models import Portugal2030Notice, NoticeFavourite


class Portugal2030NoticeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portugal2030Notice
        fields = '__all__'


class NoticeFavouriteToggleSerializer(serializers.Serializer):
    notice_code = serializers.CharField(max_length=100)

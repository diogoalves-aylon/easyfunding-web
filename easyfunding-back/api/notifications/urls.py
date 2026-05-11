from django.urls import path
from .sse import notifications_stream
from .views import (
    RegisterDeviceView, SendNotificationView, MyNotificationsView,
    MarkNotificationReadView, DeleteNotificationView, ClearNotificationsView
)

urlpatterns = [
    path("devices/register/", RegisterDeviceView.as_view()),
    path("send/", SendNotificationView.as_view()),
    path("", MyNotificationsView.as_view()),
    path("<int:pk>/read/", MarkNotificationReadView.as_view()),
    path("<int:pk>/", DeleteNotificationView.as_view()),
    path("clear/", ClearNotificationsView.as_view()),
    path("stream/", notifications_stream),
]
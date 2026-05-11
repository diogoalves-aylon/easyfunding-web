from django.urls import path
from .views import (
    DashboardView,
    Portugal2030NoticeListView,
    Portugal2030NoticeDetailView,
    NoticeFavouriteListView,
    NoticeFavouriteToggleView,
)

urlpatterns = [
    path('', Portugal2030NoticeListView.as_view(), name='notices-pt2030-list'),
    path('dashboard/', DashboardView.as_view(), name='notices-pt2030-dashboard'),
    path('favourites/', NoticeFavouriteListView.as_view(), name='notices-pt2030-favourites'),
    path('favourites/toggle/', NoticeFavouriteToggleView.as_view(), name='notices-pt2030-favourites-toggle'),
    path('<str:code>/', Portugal2030NoticeDetailView.as_view(), name='notices-pt2030-detail'),
]

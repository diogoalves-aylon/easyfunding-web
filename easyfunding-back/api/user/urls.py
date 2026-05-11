from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.user.views import ChangePasswordView, RegisterView, UserDetailView, UserViewSet, GroupViewSet, UserDeleteView, AdminEditUserView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'groups', GroupViewSet, basename='group')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('me/', UserDetailView.as_view(), name='user_detail'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('delete-account/', UserDeleteView.as_view(), name='user_delete'),
    path('edit-profile/<int:user_id>/', AdminEditUserView.as_view(), name='edit_profile'),
    path('', include(router.urls)),
]

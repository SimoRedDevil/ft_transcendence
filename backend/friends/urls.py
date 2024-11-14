from django.urls import path, include
from .views import FriendRequestViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'requests', FriendRequestViewSet, basename='requests')

urlpatterns = router.urls
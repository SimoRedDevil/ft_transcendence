from django.urls import path, include
from .views import FriendRequestViewSet, FriendViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'requests', FriendRequestViewSet, basename='requests')
router.register(r'friendlist', FriendViewSet, basename='friendlist')

urlpatterns = router.urls
from rest_framework import serializers
from .models import FriendRequest, Friend
from authentication.serializers import UserSerializer

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['id', 'created_at', 'status', 'sender', 'receiver']

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ['id', 'user', 'friends', 'status']
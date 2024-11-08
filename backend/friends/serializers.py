from rest_framework import serializers
from .models import FriendRequest, Friend
from authentication.serializers import UserSerializer

class FriendRequestSerializer(serializers.ModelSerializer):
    sender_info = UserSerializer(source='sender', read_only=True)
    receiver_info = UserSerializer(source='receiver', read_only=True)
    class Meta:
        model = FriendRequest
        fields = ['id', 'created_at', 'status', 'sender_info', 'receiver_info']

class FriendSerializer(serializers.ModelSerializer):
    user_info = UserSerializer(source='user', read_only=True)
    class Meta:
        model = Friend
        fields = ['id', 'user_info', 'friends', 'status']
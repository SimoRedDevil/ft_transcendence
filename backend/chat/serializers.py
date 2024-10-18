from rest_framework import serializers
from .models import conversation, message
from authentication.serializers import UserSerializer

class ConversationSerializer(serializers.ModelSerializer):
    user1_info = UserSerializer(source='user1_id', read_only=True)
    user2_info = UserSerializer(source='user2_id', read_only=True)
    class Meta:
        model = conversation
        fields = ['id', 'user1_info', 'creation_time', 'last_message', 'user2_info']

class MessageSerializer(serializers.ModelSerializer):
    sender_info = UserSerializer(source='sender_id', read_only=True)
    receiver_info = UserSerializer(source='receiver_id', read_only=True)
    class Meta:
        model = message
        fields = ['id', 'conversation_id', 'sender_info', 'receiver_info', 'content', 'timestamp', 'seen', 'get_human_readable_time']
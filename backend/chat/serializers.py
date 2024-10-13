from rest_framework import serializers
from .models import conversation, message
from authentication.serializers import UserSerializer

class ConversationSerializer(serializers.ModelSerializer):
    receiver_info = UserSerializer(source='user2_id', read_only=True)
    class Meta:
        model = conversation
        fields = ['id', 'user1_id', 'creation_time', 'last_message', 'receiver_info']

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = message
        fields = '__all__'
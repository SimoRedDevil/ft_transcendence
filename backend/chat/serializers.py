from rest_framework import serializers
from .models import conversation, message

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = conversation
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = message
        fields = '__all__'
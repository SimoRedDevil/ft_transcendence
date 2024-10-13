from django.shortcuts import render
from rest_framework import viewsets
from .models import conversation, message
from .serializers import ConversationSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated

class ConversationViewSet(viewsets.ModelViewSet):
    # permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return conversation.objects.filter(user1_id=self.request.user.id) | conversation.objects.filter(user2_id=self.request.user.id)
    serializer_class = ConversationSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = message.objects.all()
    serializer_class = MessageSerializer
from django.shortcuts import render
from rest_framework import viewsets
from .models import conversation, message
from .serializers import ConversationSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

class ConversationViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationSerializer
    def get_queryset(self):
        return conversation.objects.filter(user1_id=self.request.user.id) | conversation.objects.filter(user2_id=self.request.user.id)

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    def get_queryset(self):
        conversation_id = self.request.GET.get('conversation_id')
        return message.objects.all()

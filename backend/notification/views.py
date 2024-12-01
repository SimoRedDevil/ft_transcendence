from django.shortcuts import render
from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

# Create your views here.

class NotificationViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = NotificationSerializer
    def get_queryset(self):
        return Notification.objects.filter(receiver=self.request.user)
    
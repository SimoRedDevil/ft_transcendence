from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .models import FriendRequest, Friend
from .serializers import FriendRequestSerializer, FriendSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import action

# Create your views here.

def check_friendship_exists(sender, receiver):
        return FriendRequest.objects.filter(sender=sender, receiver=receiver).exists()

class FriendRequestViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]
    serializer_class = FriendRequestSerializer
    http_method_names = ['get', 'post', 'put', 'delete']
    
    def create(self, request):
        data = request.data
        serializer = self.get_serializer(data=data)
        if serializer.is_valid() == False:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        if (check_friendship_exists(data['sender'], data['receiver']) or check_friendship_exists(data['receiver'], data['sender'])):
            return Response({"detail: Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        return FriendRequest.objects.all()

    @action(detail=True, methods=['put'])
    def accept_request(self, request, pk=None):
        friendship_instance = self.get_object()
        if (not friendship_instance.accept_request()):
            return Response("{detail: Friend request already accepted}", status=status.HTTP_400_BAD_REQUEST)
        return Response("{detail: Friend request accepted}", status=status.HTTP_200_OK)

    @action(detail=True, methods=['put'])
    def reject_request(self, request, pk=None):
        friendship_instance = self.get_object()
        if (not friendship_instance.reject_request()):
            return Response("{detail: Friend request already rejected}", status=status.HTTP_400_BAD_REQUEST)
        return Response("{detail: Friend request rejected}", status=status.HTTP_200_OK)

class FriendViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]
    serializer_class = FriendSerializer
    http_method_names = ['get', 'post', 'put', 'delete']

    def get_queryset(self):
        return Friend.objects.all()
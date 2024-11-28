from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from rest_framework import status
from .models import FriendRequest
from .serializers import FriendRequestSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import action, api_view
from authentication.models import CustomUser
from django.db.models import Q

# Create your views here.

def check_friendrequest_exists(sender, receiver):
    return FriendRequest.objects.filter(sender=sender, receiver=receiver).exists()

class CreateRequest(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        data = request.data
        response = Response()
        if (check_friendrequest_exists(data['sender'], data['receiver']) or check_friendrequest_exists(data['receiver'], data['sender'])):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Friend request already sent"
            return response
        if (data['sender'] == data['receiver']):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Cannot send friend request to yourself"
            return response
        if (request.user != CustomUser.objects.get(id=data['sender'])):
            response = Response(status=status.HTTP_401_UNAUTHORIZED)
            response.data = "Unauthorized operation"
            return response
        serializer = FriendRequestSerializer(data=data)
        if serializer.is_valid() == False:
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = serializer.errors
            return response
        FriendRequest.objects.create(sender=CustomUser.objects.get(id=data['sender']), receiver=CustomUser.objects.get(id=data['receiver']))
        response = Response(status=status.HTTP_201_CREATED)
        response.data = "Friend request sent"
        return response

class GetRequests(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        user = request.user
        friend_requests = FriendRequest.objects.filter(Q(status='P'))
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data)

class AcceptRequest(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        id = request.data['id']
        response = Response()
        if (not FriendRequest.objects.filter(id=id).exists()):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Friend request does not exist"
            return response
        friend_req = FriendRequest.objects.get(id=id)
        if (request.user.id != friend_req.receiver.id):
            response = Response(status=status.HTTP_401_UNAUTHORIZED)
            response.data = "Unauthorized operation"
            return response
        if (not friend_req.accept_request()):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Friend request already accepted"
            return response
        request.user.friends.add(friend_req.sender)
        response = Response(status=status.HTTP_200_OK)
        response.data = "Friend request accepted"
        return response

class RejectRequest(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        id = request.data['id']
        response = Response()
        if (not FriendRequest.objects.filter(id=id).exists()):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Friend request does not exist"
            return response
        friend_req = FriendRequest.objects.get(id=id)
        if (request.user.id != friend_req.receiver.id):
            if (request.user.id == friend_req.sender.id):
                friend_req.delete()
                response = Response(status=status.HTTP_200_OK)
                response.data = "Friend request cancelled"
                return response
            response = Response(status=status.HTTP_401_UNAUTHORIZED)
            response.data = "Unauthorized operation"
            return response
        if (not friend_req.reject_request()):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Friend request already rejected"
            return response
        response = Response(status=status.HTTP_200_OK)
        response.data = "Friend request rejected"
        return response

class RemoveFriend(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        friend_id = request.data['id']
        user = request.user
        response = Response()
        friend = CustomUser.objects.get(id=friend_id)
        if (friend not in user.friends.all()):
            response = Response(status=status.HTTP_400_BAD_REQUEST)
            response.data = "Friend not found"
            return response
        user.friends.remove(friend)
        response = Response(status=status.HTTP_200_OK)
        response.data = "Friend removed"
        return response

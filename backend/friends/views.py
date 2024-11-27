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
        if (check_friendrequest_exists(data['sender'], data['receiver']) or check_friendrequest_exists(data['receiver'], data['sender'])):
            return Response({"detail: Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)
        if (data['sender'] == data['receiver']):
            return Response({"detail: Cannot send friend request to yourself."}, status=status.HTTP_400_BAD_REQUEST)
        if (request.user != CustomUser.objects.get(id=data['sender'])):
            return Response({"detail: Unauthorized operation"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = FriendRequestSerializer(data=data)
        if serializer.is_valid() == False:
            return Response({"detail: data not valid"}, status=status.HTTP_400_BAD_REQUEST)
        FriendRequest.objects.create(sender=CustomUser.objects.get(id=data['sender']), receiver=CustomUser.objects.get(id=data['receiver']))
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class GetRequests(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        user = request.user
        friend_requests = FriendRequest.objects.filter(Q(receiver=user.id) & Q(status='P'))
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data)

class AcceptRequest(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        id = request.data['id']
        if (not FriendRequest.objects.filter(id=id).exists()):
            return Response("{detail: Friend request does not exist}", status=status.HTTP_400_BAD_REQUEST)
        friend_req = FriendRequest.objects.get(id=id)
        print(friend_req.receiver, flush=True)
        if (request.user.id != friend_req.receiver.id):
            return Response("{detail: Unauthorized operation}", status=status.HTTP_401_UNAUTHORIZED)
        if (not friend_req.accept_request()):
            return Response("{detail: Friend request already accepted}", status=status.HTTP_400_BAD_REQUEST)
        request.user.friends.add(friend_req.sender)
        return Response("{detail: Friend request accepted}", status=status.HTTP_200_OK)

class RejectRequest(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        id = request.data['id']
        if (not FriendRequest.objects.filter(id=id).exists()):
            return Response("{detail: Friend request does not exist}", status=status.HTTP_400_BAD_REQUEST)
        friend_req = FriendRequest.objects.get(id=id)
        if (request.user.id != friend_req.receiver.id):
            return Response("{detail: Unauthorized operation}", status=status.HTTP_401_UNAUTHORIZED)
        if (not friend_req.reject_request()):
            return Response("{detail: Friend request already rejected}", status=status.HTTP_400_BAD_REQUEST)
        return Response("{detail: Friend request rejected}", status=status.HTTP_200_OK)

class CheckFriendRequestExists(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def get(self, request):
        user = request.query_params.get('user')
        return Response(False, status=status.HTTP_200_OK)

class RemoveFriend(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        user = request.user
        friend = CustomUser.objects.get(id=request.data['id'])
        if (friend not in user.friends.all()):
            return Response("{detail: User is not your friend}", status=status.HTTP_400_BAD_REQUEST)
        user.friends.remove(friend)
        return Response("{detail: Friend removed}", status=status.HTTP_200_OK)

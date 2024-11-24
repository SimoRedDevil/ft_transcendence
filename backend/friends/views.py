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
from authentication.serializers import UserSerializer
from django.db.models import Q

# Create your views here.

def check_friendship_exists(sender, receiver):
    return FriendRequest.objects.filter(sender=sender, receiver=receiver).exists()

def check_friendrequest_exists(sender, receiver):
    return FriendRequest.objects.filter(sender=sender, receiver=receiver).filter(status != 'A').exists()

class CreateRequest(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication]

    def post(self, request):
        data = request.data
        if (check_friendship_exists(data['sender'], data['receiver']) or check_friendship_exists(data['receiver'], data['sender'])):
            return Response({"detail: Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)
        if (data['sender'] == data['receiver']):
            return Response({"detail: Cannot send friend request to yourself."}, status=status.HTTP_400_BAD_REQUEST)
        if (request.user != CustomUser.objects.get(id=data['sender'])):
            return Response({"detail: Unauthorized operation"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = FriendRequestSerializer(data=data)
        if serializer.is_valid() == False:
            return Response({"detail: data not valid"}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
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
        if (request.user.id != friend_req.receiver):
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

# class FriendRequestViewSet(ModelViewSet):
#     permission_classes = [IsAuthenticated]
#     authentication_classes = [SessionAuthentication]
#     serializer_class = FriendRequestSerializer
#     http_method_names = ['get', 'post', 'put', 'delete']
    
#     def create(self, request):
#         data = request.data
#         serializer = self.get_serializer(data=data)
#         if serializer.is_valid() == False:
#             return Response({"detail: data not valid"}, status=status.HTTP_400_BAD_REQUEST)
#         if (check_friendship_exists(data['sender'], data['receiver']) or check_friendship_exists(data['receiver'], data['sender'])):
#             return Response({"detail: Friend request already sent."}, status=status.HTTP_400_BAD_REQUEST)
#         if (data['sender'] == data['receiver']):
#             return Response({"detail: Cannot send friend request to yourself."}, status=status.HTTP_400_BAD_REQUEST)
#         if (self.request.user != CustomUser.objects.get(id=data['sender'])):
#             return Response({"detail: Unauthorized operation"}, status=status.HTTP_401_UNAUTHORIZED)
#         self.perform_create(serializer)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def get_queryset(self):
#         return FriendRequest.objects.all()

#     @action(detail=True, methods=['put'])
#     def accept_request(self, request, pk=None):
#         friendship_instance = self.get_object()
#         if (self.request.user.id != friendship_instance.receiver):
#             return Response("{detail: Unauthorized operation}", status=status.HTTP_401_UNAUTHORIZED)
#         if (not friendship_instance.accept_request()):
#             return Response("{detail: Friend request already accepted}", status=status.HTTP_400_BAD_REQUEST)
#         self.request.user.friends.add(friendship_instance.sender)
#         return Response("{detail: Friend request accepted}", status=status.HTTP_200_OK)

#     @action(detail=True, methods=['put'])
#     def reject_request(self, request, pk=None):
#         friendship_instance = self.get_object()
#         if (self.request.user.id != friendship_instance.receiver):
#             return Response("{detail: Unauthorized operation}", status=status.HTTP_401_UNAUTHORIZED)
#         if (not friendship_instance.reject_request()):
#             return Response("{detail: Friend request already rejected}", status=status.HTTP_400_BAD_REQUEST)
#         return Response("{detail: Friend request rejected}", status=status.HTTP_200_OK)
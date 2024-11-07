from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import FriendRequest
from .serializers import FriendRequestSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

# Create your views here.

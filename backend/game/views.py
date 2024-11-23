from django.shortcuts import render
from django.http import JsonResponse
from .models import Player, Match
from rest_framework.decorators import api_view
from .serializers import PlayerSerializer, MatchSerializer
from rest_framework.response import Response
# Create your views here.

@api_view(['GET'])
def get_all_players(request):
    players = Player.objects.all()
    serializer = PlayerSerializer(players, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_all_matches(request):
    matches = Match.objects.all()
    serializer = MatchSerializer(matches, many=True)
    return Response(serializer.data)
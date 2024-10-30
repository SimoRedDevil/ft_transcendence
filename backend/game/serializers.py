from rest_framework import serializers
from .models import Player, Match

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'
        
class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = ['pk', 'player1_in_match', 'player2_in_match', 'score1', 'score2', 'match_winner']
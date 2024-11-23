from rest_framework import serializers
from .models import Player, Match
from authentication.models import CustomUser

class PlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Player
        fields = '__all__'
        
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'        

class MatchSerializer(serializers.ModelSerializer):
    player1 = CustomUserSerializer()
    player2 = CustomUserSerializer()
    winer = CustomUserSerializer()
    
    class Meta:
        model = Match
        fields = ['id', 'player1', 'player2', 'score1', 'score2', 'winer']
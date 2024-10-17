import json
import math
import asyncio
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer



class Tournament(AsyncWebsocketConsumer):
    
    players = []
    players_tournament = []
    
    async def connect(self):
        await self.accept()
        self.player = None
        self.game_channel = ""
    
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['type']
        
        if message == 'connection':
            self.player = {
                'name': data['data']['username'],
                'id': self.channel_name,
                'player_id': '',
                'group_name': ''
            }
        Tournament.players.append(self.player)
        Tournament.players_tournament.append(self.player)
        await self.send(text_data=json.dumps({
            'type': 'connected',
            'player': self.player
        }))
        await self.create_tournament()
        
        
    async def disconnect(self, close_code):
        pass
    
    async def create_tournament(self):
        if len(Tournament.players_tournament) >= 4:
            for playername in Tournament.players_tournament:
                self.game_channel += playername['name']
            for player in Tournament.players_tournament:
                player['group_name'] = self.game_channel
            for i , player in enumerate(Tournament.players_tournament, start=1):
                player['player_id'] = f'player{i}'
            for player in Tournament.players_tournament:
                await self.channel_layer.group_add(
                    player['group_name'],
                    player['id']
                ) 
            for _ in range(4):
                player = Tournament.players_tournament.pop(0)
                await self.channel_layer.group_send(
                    player['group_name'],
                    {
                        'type': 'start_game',
                        'player': player
                    }
                )
                
                
    async def start_game(self, event):
        player = event['player']
        await self.send(text_data=json.dumps({
            'type': 'game_started',
            'player': player
        }))

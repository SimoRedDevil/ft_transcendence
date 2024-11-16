import json
import math
import asyncio
from asgiref.sync import sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer


class paddles:
    def __init__(self, x, y,width, height, speed, color, chan_name, playerNu, username):
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.color = color
        self.speed = speed
        self.chan_name = chan_name
        self.username = username
        self.playerNu = playerNu
        self.score = 0
        
        
        
    def to_dict(self):
        return {
            'x': self.x,
            'y': self.y,
            'width': self.width,
            'height': self.height,
            'color': self.color,
            'speed': self.speed,
            'chan_name': self.chan_name,
            'playerNu': self.playerNu,
            'username': self.username,
            'score': self.score
        }
        

        
class ball:
    def __init__(self, x, y, radius, dirrectionY, speed,color):
        self.x = x
        self.y = y
        self.radius = radius
        self.color = color
        self.directionX = 0
        self.directionY = dirrectionY
        self.speed = speed

    def to_dict(self):
        return {
            'x': self.x,
            'y': self.y,
            'radius': self.radius,
            'color': self.color,
            'directionX': self.directionX,
            'directionY': self.directionY,
            'speed': self.speed
        }

class Tournament(AsyncWebsocketConsumer):

    players = []
    Tournaments = {}
    tour_players = []
    players_tournament = []
    paddles = {}
    games = {}
    Ball = {}
    
    async def connect(self):
        await self.accept()
        self.player = None
        self.game_channel = None
        self.group_name_tournament = ""
        
        
    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'connection':
            self.player = {
                'name': data['playerName'],
                'id': self.channel_name,
                'player_id': '',
                'group_name': ''
            }
            self.players.append(self.player)
            self.players_tournament.append(self.player)
            await self.send(text_data=json.dumps({
                'type': 'connection',
                'player': self.player
            }))
            if len(self.players_tournament) >= 4:
                room_name = ''
                for player in self.players_tournament:
                    room_name += f'{player["name"]}'
                for _ in range(4):
                    player = self.players_tournament.pop(0)
                    Tournament.tour_players.append(player)
                    player['group_name'] = room_name
                    player['player_id'] = f'player{_+1}'
                    await self.channel_layer.group_add(
                        room_name,
                        player['id']
                    )
                Tournament.Tournaments[room_name] = self.tour_players
                await self.channel_layer.group_send(
                    room_name,
                    {
                        'type': 'tournament_start',
                        'players': self.tour_players
                    }
                )
    
        if data['type'] == 'game_start':
            print(data)
            
            
         
            
               
            
    async def disconnect(self, close_code):
        if self.player in Tournament.players:
            other_player_id = 'player1' if self.player['player_id'] == 'player2' else 'player2'
            game = self.games.get(self.player['group_name'])
            if self.player['group_name'] in self.games:
                await self.channel_layer.group_send(
                    self.player['group_name'],
                    {
                        'type': 'game_over',
                        'winner': game[other_player_id].username
                    }
                )
                await self.channel_layer.group_discard(
                    self.player['group_name'],
                    self.player['id']
                )
                await self.channel_layer.group_discard(
                    self.player['group_name'],
                    game[other_player_id].chan_name
                )
                del self.games[self.player['group_name']]
          

    async def tournament_start(self, event):
        await self.send(text_data=json.dumps({
            'type': 'tournament_start',
            'players': event['players']
        }))
    
    async def matchmaking(self, data):
        player1 = Game.match_making.pop(0)
        player1['player_id'] = 'player1'
        player2 = Game.match_making.pop(0)
        player2['player_id'] = 'player2'
        self.game_channel = f'game{player1["name"]}vs{player2["name"]}'
        player1['group_name'] = self.game_channel
        player2['group_name'] = self.game_channel
        await self.channel_layer.group_add(
            self.game_channel,
            player1['id']
        )
        
        await self.channel_layer.group_add(
            self.game_channel,
            player2['id']
        )

        self.paddles['player1'] = paddles(data['data']['x'],data['data']['y1'], data['data']['pw'], data['data']['ph'] ,data['data']['sp'], 'white', player1['id'], 1, player1['name'])
        self.paddles['player2'] = paddles(data['data']['x'],data['data']['y2'],data['data']['pw'], data['data']['ph'], data['data']['sp'], 'white', player2['id'], 2, player2['name'])
        self.Ball = ball(0.5, 0.5, data['data']['Walls']['wallsHeight']/25/2/data['data']['Walls']['wallsHeight'], data['data']['dirY'], data['data']['sp'] ,'white')
        self.games[self.game_channel] = {
            'player1' : self.paddles['player1'],
            'player2' : self.paddles['player2'],
            'ball' : self.Ball,
        }
        await self.update_matchCount(player1['name'])
        await self.update_matchCount(player2['name'])
        game_serialized = {
            'player1': self.games[self.game_channel]['player1'].to_dict(),
            'player2': self.games[self.game_channel]['player2'].to_dict(),
            'ball': self.games[self.game_channel]['ball'].to_dict()
        }
        await self.channel_layer.group_send(
            self.game_channel,
            {
                'type': 'start_game',
                'players': [player1, player2],
                'game_channel': self.game_channel,
                'game_serialized': game_serialized,
            }
        )
        asyncio.create_task(self.update_ball_loop(self.game_channel))
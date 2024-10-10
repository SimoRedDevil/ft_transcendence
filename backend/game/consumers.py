import json
from channels.generic.websocket import AsyncWebsocketConsumer


class paddles:
    def __init__(self, x, width, speed, color, chan_name):
        self.x = x
        self.width = width
        self.color = color
        self.speed = speed
        self.chan_name = chan_name
        
    def to_dict(self):
        return {
            'x': self.x,
            'width': self.width,
            'color': self.color,
            'speed': self.speed,
            'chan_name': self.chan_name
        }
        
class ball:
    def __init__(self, x, y, radius, color):
        self.x = x
        self.y = y
        self.radius = radius
        self.color = color
        self.directionX = 1
        self.directionY = 1
        self.speed = 1

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

class Game(AsyncWebsocketConsumer):

    players = []
    match_making = []
    paddles = {}
    Ball = {}
    async def connect(self):
        await self.accept()
        self.player = None
        self.game_channel = None
        self.playerID = None
        
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        if data['type'] == 'connection':
            self.player = {
                'name': data['data']['username'],
                'id': self.channel_name,
                'player_id': ''
            }
            Game.players.append(self.player)
            Game.match_making.append(self.player)
            await self.send(text_data=json.dumps({
                'type': 'connection',
                'player': self.player
            }))
            await self.matchmaking(data)
        if data['type'] == 'move':
            if data['direction'] == 'right':
                if (self.paddles[self.player['player_id']].x + self.paddles[self.player['player_id']].width + self.paddles[self.player['player_id']].speed > 1):
                    self.paddles[self.player['player_id']].x = 1 - self.paddles[self.player['player_id']].width
                else:
                    self.paddles[self.player['player_id']].x += self.paddles[self.player['player_id']].speed
            if data['direction'] == 'left':
                if self.paddles[self.player['player_id']].x - self.paddles[self.player['player_id']].speed > 0:
                    self.paddles[self.player['player_id']].x -= self.paddles[self.player['player_id']].speed
                else:
                    self.paddles[self.player['player_id']].x = 0

            await self.channel_layer.group_send(
            data['game_channel'],
            {
                'type': 'paddle_update',
                'playernumber': self.player['player_id'],
                'paddle': self.paddles[self.player['player_id']].to_dict()
            })
        if data['type'] == 'update_ball':
            self.Ball.x += self.Ball.directionX
            self.Ball.y += self.Ball.directionY
            await self.channel_layer.group_send(
                data['game_channel'],
                {
                    'type': 'update_ball',
                    'ball': self.Ball.to_dict()
                }
            )
            
    async def disconnect(self, close_code):
        pass


    async def matchmaking(self, data):
        if len(Game.match_making) >= 2:
            player1 = Game.match_making.pop(0)
            player1['player_id'] = 'player1'
            player2 = Game.match_making.pop(0)
            player2['player_id'] = 'player2'
            self.game_channel = f'game{player1["name"]}vs{player2["name"]}'
            await self.channel_layer.group_add(
                self.game_channel,
                player1['id']
            )
            
            await self.channel_layer.group_add(
                self.game_channel,
                player2['id']
            )
            self.paddles[player1['player_id']] = paddles(data['data']['x'], data['data']['pw'], data['data']['sp'], 'white', player1['id'])
            self.paddles[player2['player_id']] = paddles(data['data']['x'], data['data']['pw'], data['data']['sp'], 'white', player2['id'])
            self.Ball = ball(0.5, 0.5, data['data']['Walls']['wallsHeight']/25/2, 'white')
            ball_json = self.Ball.to_dict()
            
            paddles_serialized = {
            player_id: paddle.to_dict() for player_id, paddle in self.paddles.items()
            }
            await self.channel_layer.group_send(
                self.game_channel,
                {
                    'type': 'start_game',
                    'players': [player1, player2],
                    'game_channel': self.game_channel,
                    'paddles': paddles_serialized,
                    'ball': ball_json,
                }
            )
    
    async def start_game(self, event):
        await self.send(text_data=json.dumps({
            'type': 'start_game',
            'players': event['players'],
            'game_channel': event['game_channel'],
            'paddles': event['paddles'],
            'ball': event['ball']
        }))
    
    async def paddle_update(self, event):
        paddle_data = event['paddle']
        await self.send(text_data=json.dumps({
            'type': 'paddle_update',
            'playernumber': event['playernumber'],
            'paddle': paddle_data,  
        }))
    
    async def update_ball(self, event):
        ball_data = event['ball']
        await self.send(text_data=json.dumps({
            'type': 'update_ball',
            'ball': ball_data
        }))
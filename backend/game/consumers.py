import json
from channels.generic.websocket import AsyncWebsocketConsumer


class paddles:
    def __init__(self, x, width, speed, color):
        self.x = x
        self.width = width
        self.color = color
        self.speed = speed
        
    def to_dict(self):
        return {
            'x': self.x,
            'width': self.width,
            'color': self.color,
            'speed': self.speed,
        }
        
class ball:
    def __init__(self, x, y, radius, color):
        self.x = x
        self.y = y
        self.radius = radius
        self.color = color
        self.direction = 1
        self.speed = 1


class Game(AsyncWebsocketConsumer):

    players = []
    match_making = []
    paddles = {}

    async def connect(self):
        await self.accept()
        self.player = None
        self.game_channel = None
        self.playerID = None
        
    async def disconnect(self, close_code):
        pass
    
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
            if data['direction'] == 'left':
                self.paddles[self.player['player_id']].x -= self.paddles[self.player['player_id']].speed
            if data['direction'] == 'right':
                self.paddles[self.player['player_id']].x += self.paddles[self.player['player_id']].speed
            await self.channel_layer.group_send(
            data['game_channel'],
            {
                'type': 'paddle_update',
                'playernumber': self.player['player_id'],
                'paddle': self.paddles[self.player['player_id']].to_dict()
            })

    async def matchmaking(self, data):
        if len(Game.match_making) >= 2:
            player1 = Game.match_making.pop(0)
            player1['player_id'] = 'player1'
            player2 = Game.match_making.pop(0)
            player2['player_id'] = 'player2'
            game_channel = f'game{player1["name"]}vs{player2["name"]}'
            await self.channel_layer.group_add(
                game_channel,
                player1['id']
            )
            await self.channel_layer.group_add(
                game_channel,
                player2['id']
            )
            self.paddles[player1['player_id']] = paddles(data['data']['x'], data['data']['pw'], data['data']['sp'], 'white')
            self.paddles[player2['player_id']] = paddles(data['data']['x'], data['data']['pw'], data['data']['sp'], 'white')

            paddles_serialized = {
            player_id: paddle.to_dict() for player_id, paddle in self.paddles.items()
            }
            await self.channel_layer.group_send(
                game_channel,
                {
                    'type': 'start_game',
                    'players': [player1, player2],
                    'game_channel': game_channel,
                    'paddles': paddles_serialized 
                }
            )
    
    async def start_game(self, event):
        await self.send(text_data=json.dumps({
            'type': 'start_game',
            'players': event['players'],
            'game_channel': event['game_channel'],
            'paddles': event['paddles']
        }))
        
    async def move(self, event):
        await self.send(text_data=json.dumps({
            'type': 'move',
            'player': event['player']
        }))
        
    async def paddle_update(self, event):
        paddle_data = event['paddle']
        await self.send(text_data=json.dumps({
            'type': 'paddle_update',
            'playernumber': event['playernumber'],
            'paddle': paddle_data
        }))
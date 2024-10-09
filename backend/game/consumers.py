import json
from channels.generic.websocket import AsyncWebsocketConsumer


class paddles:
    def __init__(self, x, width, speed, color):
        self.x = x
        self.width = width
        self.height = height
        self.color = color
        self.speed = speed
        
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
                'name': data['username'],
                'id': self.channel_name
            }
            Game.players.append(self.player)
            Game.match_making.append(self.player)
            await self.send(text_data=json.dumps({
                'type': 'connection',
                'player': self.player
            }))
            await self.matchmaking(data)
        if data['type'] == 'move':
            print(data['game_channel'])
            
            await self.channel_layer.group_send(
                data['game_channel'],
                {
                    'type': 'move',
                    'player': self.player
                }
            )
            
    async def matchmaking(self, data):
        if len(Game.match_making) >= 2:
            player1 = Game.match_making.pop(0)
            player2 = Game.match_making.pop(0)
            game_channel = f'game{player1["name"]}vs{player2["name"]}'
            await self.channel_layer.group_add(
                game_channel,
                player1['id']
            )
            await self.channel_layer.group_add(
                game_channel,
                player2['id']
            )
            self.paddles[player1['id']] = paddles(data['x'], data['pw'], 8, 'white')
            self.paddles[player2['id']] = paddles(data['x'], data['pw'], 8, 'white')
            await self.channel_layer.group_send(
                game_channel,
                {
                    'type': 'start_game',
                    'players': [player1, player2],
                    'game_channel': game_channel,
                    'paddles': self.paddles
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
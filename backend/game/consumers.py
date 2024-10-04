import json
from channels.generic.websocket import AsyncWebsocketConsumer



class Game(AsyncWebsocketConsumer):
    all_games = []
    async def connect(self):
        for game in self.all_games:
            if (game['player1'] is None):
                game['player1'] = self.channel_name
                gameId = game.get('id')
                await self.channel_layer.group_add(f"game_{gameId}", self.channel_name)
                await self.accept()
                return
            elif (game['player2'] is None):
                game['player2'] = self.channel_name
                gameId = game.get('id')
                await self.channel_layer.group_add(f"game_{gameId}", self.channel_name)
                await self.accept()
                return

        newGameId = len(self.all_games) + 1
        newGame = {
            'id': newGameId,
            'player1': self.channel_name,
            'player2': None,
        }
        self.all_games.append(newGame)
        await self.channel_layer.group_add(f"game_{newGameId}", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data_from_client = json.loads(text_data)
        message_type = data_from_client['type']
        if (message_type == 'init'):
            self.player1 = data_from_client['player1']
            self.walls = data_from_client['walls']
        if (message_type == 'move'):
            message_direction = data_from_client['direction']
            if (message_direction == 'right'):
                if (self.player1['x'] + self.player1['paddleWidth'] + self.player1['speedPaddle'] > 1):
                    self.player1['x'] = 1 - self.player1['paddleWidth']
                else:
                    self.player1['x'] += self.player1['speedPaddle']
            if (message_direction == 'left'):
                if (self.player1['x'] - self.player1['speedPaddle'] > 0):
                    self.player1['x'] -= self.player1['speedPaddle']
                else:
                    self.player1['x'] = 0
            await self.channel_layer.group_send("game", {
                'type': 'update_position',
                'x': self.player1['x'],
            })
            
    async def update_position(self, event):
        await self.send(text_data=json.dumps({
            'type': 'update_position',
            'player': 
            'x': event['x'],
        }))
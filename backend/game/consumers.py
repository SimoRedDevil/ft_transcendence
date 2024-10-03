import json
from channels.generic.websocket import AsyncWebsocketConsumer



class Game(AsyncWebsocketConsumer):
    player1 = None
    walls = None

    async def connect(self):
        await self.channel_layer.group_add("game", self.channel_name)
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
                if (self.player1['x'] + self.player1['paddleWidth'] + self.player1['speedPaddle'] > self.walls['wallsWidth'] - 4):
                    self.player1['x'] = self.walls['wallsWidth'] - self.player1['paddleWidth'] - 4
                else:
                    self.player1['x'] += self.player1['speedPaddle']
            if (message_direction == 'left'):
                if (self.player1['x'] - self.player1['speedPaddle'] > 4):
                    self.player1['x'] -= self.player1['speedPaddle']
                else:
                    self.player1['x'] = 4
            await self.channel_layer.group_send("game", {
                'type': 'update_position',
                'x': self.player1['x'],
            })
            
    async def update_position(self, event):
        await self.send(text_data=json.dumps({
            'type': 'update_position',
            'x': event['x'],
        }))
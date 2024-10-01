import json
from channels.generic.websocket import AsyncWebsocketConsumer



class Game(AsyncWebsocketConsumer):
    player1 = None
    walls = None

    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        data_from_client = json.loads(text_data)
        message_type = data_from_client['type']
        if (message_type == 'init'):
            await self.init_data()
        if (message_type == 'move'):
            await self.move_paddle(data_from_client['direction'])
           
        
    async def move_paddle(self, dir):
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
        await self.send(json.dumps({'x': self.player1['x']}))
        
    ayync def init_dat(self):
        self.walls = data_from_client['walls']
        self.player1 = data_from_client['player1']
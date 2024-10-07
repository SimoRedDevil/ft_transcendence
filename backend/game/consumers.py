import json
from channels.generic.websocket import AsyncWebsocketConsumer



class Game(AsyncWebsocketConsumer):
    group_name = ""
    player_id = ""
    games = []
    game = {
        'group_name': "",
        'player1': "",
        'player2': "",
    }

    async def connect(self):
        await self.accept()
        
    async def disconnect(self, close_code):
        pass
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        if message == "connection":
            print(text_data_json)
            game['group_name'] = "game"
            if text_data_json['username'] == "" and game['player1'] == "":
                game['player1'] = "player1"
            else:
                game['player2'] = "player2"
                await self.channel_layer.group_add("game",self.channel_name)
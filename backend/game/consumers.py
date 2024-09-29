from channels.generic.websocket import AsyncWebsocketConsumer


class Game(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send("You are connected")
        
    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data):
        print(text_data)
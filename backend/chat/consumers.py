import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        print(self.scope['user'].id)
        
    async def disconnect(self, close_code):
        print("disconnected")
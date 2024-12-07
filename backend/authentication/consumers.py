# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import CustomUser
from collections import defaultdict
import json


@database_sync_to_async
def update_user_status(user_id, status):
    user = CustomUser.objects.get(id=user_id)
    user.online = status
    user.save()

class MyWebSocketConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope['user']
        self.room_group_name = 'online_users'
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        if not self.user.is_authenticated:
            await self.close()
        else:
            await update_user_status(self.user.id, True)
            await self.accept()
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_status',
                    'user_id': self.user.username,
                    'status': 'online'
                }
            )

    async def disconnect(self, close_code):
        await update_user_status(self.user.id, False)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_status',
                'user_id': self.user.username,
                'status': 'offline'
            }
        )
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    async def user_status(self, event):
        await self.send(text_data=json.dumps(event))
# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import CustomUser
from collections import defaultdict
import json

online_users = defaultdict(list)

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
            await self.accept()
            online_users[self.user.username].append(self.channel_name)
            await update_user_status(self.user.id, True)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_status',
                    'online_users': online_users
                }
            )

    async def disconnect(self, close_code):
        online_users.pop(self.user.username)
        await update_user_status(self.user.id, False)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'user_status',
                'online_users': online_users
            }
        )
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    async def user_status(self, event):
        await self.send(text_data=json.dumps(event))
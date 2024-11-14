from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from authentication.models import CustomUser

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        # if user.is_anonymous or not user.is_authenticated:
        #     await self.close()
        # else:
        self.user = user
        self.room_group_name = f'notif_{user.username}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
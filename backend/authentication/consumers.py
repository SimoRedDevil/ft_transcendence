# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import CustomUser
from collections import defaultdict
import json

User = CustomUser

active_tabs = defaultdict(int)
class MyWebSocketConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get("user")
        if self.user and self.user.is_authenticated:
            active_tabs[self.user.id] += 1
            await self.set_user_online_status(True)

        await self.accept()

    async def disconnect(self, close_code):
        if self.user and self.user.is_authenticated:
            active_tabs[self.user.id] -= 1
            if active_tabs[self.user.id] == 0:
                await self.set_user_online_status(False)
        else:
            await self.set_user_online_status(False)

    async def set_user_online_status(self, status):
        await database_sync_to_async(self.update_status)(status)

    def update_status(self, status):
        try:
            user = User.objects.get(pk=self.user.id)
            user.online = status
            user.save()
        except User.DoesNotExist:
            response =  {'error': 'User not found'}
            return response
    
    async def broadcast_message(self, event):
        message = event["message"]
        await self.send(text_data=message)

    async def broadcast_online_users(self):
        online_users = CustomUser.objects.filter(online=True).values_list("id", flat=True)
        message = json.dumps({
            "type": "user_status_update",
            "online_users": list(online_users),
        })
        await self.channel_layer.group_send("online_status", {
            "type": "broadcast_message",
            "message": message,
        })

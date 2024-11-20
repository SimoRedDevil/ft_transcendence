# consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import CustomUser

User = CustomUser

class MyWebSocketConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope.get("user")
        if self.user and self.user.is_authenticated:
            await self.set_user_online_status(True)

        await self.accept()

    async def disconnect(self, close_code):
        if self.user and self.user.is_authenticated:
            # Set the user as offline
            await self.set_user_online_status(False)

    async def set_user_online_status(self, status):
        await database_sync_to_async(self.update_online_status)(status)

    def update_online_status(self, status):
        try:
            user = User.objects.get(pk=self.user.id)
            user.is_online = status
            user.save()
        except User.DoesNotExist:
            pass  # Handle cases where the user is not found

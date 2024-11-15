import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from authentication.models import CustomUser

@database_sync_to_async
def get_user(username):
    try:
        return CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        return None

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # user = self.scope['user']
        # if user.is_anonymous or not user.is_authenticated:
        #     await self.close()
        # else:
        user = self.scope["url_route"]["kwargs"]["user"]
        self.user = user
        print(self.user, flush=True)
        self.room_group_name = f'notif_{user}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
    async def disconnect(self, close_code):
        pass
    async def receive(self, text_data):
        data = json.loads(text_data)
        notif_type = data['notif_type']
        sender = await get_user(data['sender'])
        receiver = await get_user(data['receiver'])

        if (sender == None or receiver == None):
            await self.close(code=4000)
        else:
            receiver_room_group_name = f'notif_{receiver.username}'
            await self.channel_layer.group_send(receiver_room_group_name, {
                'type': 'send_notification',
                'notif_type': notif_type,
                'sender': sender.username,
                'receiver': receiver.username
            })
    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'notif_type': event['notif_type'],
            'sender': event['sender'],
            'receiver': event['receiver']
        }))
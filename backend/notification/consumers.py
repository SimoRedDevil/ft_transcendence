import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from authentication.models import CustomUser
from .models import Notification

@database_sync_to_async
def get_user(username):
    try:
        return CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        return None

@database_sync_to_async
def create_notification(sender, receiver, notif_type, title, description):
    return Notification.objects.create(sender=sender, receiver=receiver, notif_type=notif_type, title=title, description=description)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        print(user, flush=True)
        # if user.is_anonymous or not user.is_authenticated:
        #     pass
        #     await self.close(code=1008)
        # else:
        self.room_group_name = f'notif_{user.username}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()
    async def disconnect(self, close_code):
        pass
    async def receive(self, text_data):
        data = json.loads(text_data)
        notif_type = data['notif_type']
        sender = await get_user(data['sender'])
        receiver = await get_user(data['receiver'])
        title = data['title']
        description = data['description']

        if (sender == None or receiver == None):
            await self.close(code=4000)
        else:
            receiver_room_group_name = f'notif_{receiver.username}'
            await self.channel_layer.group_send(receiver_room_group_name, {
                'type': 'send_notification',
                'notif_type': notif_type,
                'sender': sender.username,
                'receiver': receiver.username,
                'title': title,
                'description': description
            })
            if (notif_type != 'invite_game'):
                await create_notification(sender, receiver, notif_type, title, description)

    async def send_notification(self, event):
        await self.send(text_data=json.dumps({
            'notif_type': event['notif_type'],
            'sender': event['sender'],
            'receiver': event['receiver'],
            'title': event['title'],
            'description': event['description']
        }))
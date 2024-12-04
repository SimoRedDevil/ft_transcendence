import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from authentication.models import CustomUser
from .models import Notification
from friends.models import FriendRequest
from datetime import datetime

@database_sync_to_async
def get_user(id):
    try:
        return CustomUser.objects.get(id=id)
    except CustomUser.DoesNotExist:
        return None

@database_sync_to_async
def get_friend_request(id):
    try:
        return FriendRequest.objects.get(id=id)
    except FriendRequest.DoesNotExist:
        return None

@database_sync_to_async
def create_notification(sender, receiver, notif_type, title, description, friend_request=None):
    return Notification.objects.create(sender=sender, receiver=receiver, notif_type=notif_type, title=title, description=description, friend_request=friend_request)

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_anonymous or not user.is_authenticated:
            pass
            await self.close(code=1008)
        else:
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

    async def send_notification(self, event):
        sender = await get_user(event['sender'])
        receiver = await get_user(event['receiver'])
        notif_type = event['notif_type']
        title = event['title']
        description = event['description']
        friend_request = None
        notif = None
        now = datetime.now().strftime("%A, %I:%M %p")

        if (notif_type == 'friend_request'):
            friend_request = await get_friend_request(event['friend_request'])

        await self.send(text_data=json.dumps({
            'notif_type': notif_type,
            'sender_info': { 'username': sender.username, 'id': sender.id, 'full_name': sender.full_name, 'avatar_url': sender.avatar_url },
            'receiver_info': { 'username': receiver.username, 'id': receiver.id, 'full_name': receiver.full_name, 'avatar_url': receiver.avatar_url },
            'title': title,
            'description': description,
            'friend_request': friend_request.id,
            'get_human_readable_time': notif.get_human_readable_time() if notif else now,
        }))
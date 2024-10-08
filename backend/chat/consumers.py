import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from authentication.models import CustomUser
from .models import conversation, message

@database_sync_to_async
def get_user(username):
    try:
        return CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        return None

@database_sync_to_async
def check_conversation_exists(user1, user2):
    return conversation.objects.filter(user1_id=user1.id, user2_id=user2.id).exists()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if user.is_anonymous or not user.is_authenticated:
            await self.close()
        else:
            self.user = user
            self.room_group_name = f'chat_{user.username}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            await self.accept()

    async def disconnect(self, close_code):
        print("disconnected")
    
    async def receive(self, text_data):
        data = json.loads(text_data)
        sent_by_user = data['sent_by_user']
        sent_to_user = data['sent_to_user']
        sender = await get_user(sent_by_user)
        receiver = await get_user(sent_to_user)
        conversation_exists = await check_conversation_exists(sender, receiver)
        print (conversation_exists)

        message = data['message']
        other_user_room_group_name = f'chat_{sent_to_user}'
        await self.channel_layer.group_send(
            other_user_room_group_name,
            {
                'type': 'send_message',
                'sent_by_user': sent_by_user,
                'message': message
            }
        )
    
    async def send_message(self, event):
        sent_by_user = event['sent_by_user']
        message = event['message']
        await self.send(text_data=json.dumps({
            'sent_by_user': sent_by_user,
            'message': message
        }))
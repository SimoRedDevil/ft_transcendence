import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from authentication.models import CustomUser
from .models import conversation, message
from django.db.models import Q

@database_sync_to_async
def get_user(username):
    try:
        return CustomUser.objects.get(username=username)
    except CustomUser.DoesNotExist:
        return None

@database_sync_to_async
def check_conversation_exists(conversation_id):
    try:
        conversation.objects.get(id=conversation_id)
        return True
    except conversation.DoesNotExist:
        return False

@database_sync_to_async
def create_conversation(user1, user2, last_message=None):
    return conversation.objects.create(user1_id=user1, user2_id=user2, last_message=last_message)

@database_sync_to_async
def get_conversation(conversation_id):
    return conversation.objects.get(id=conversation_id)

@database_sync_to_async
def set_conversation_last_msg(conversation_obj, last_message):
    conversation_obj.last_message = last_message
    conversation_obj.save()

@database_sync_to_async
def create_message(conversation, sender, receiver, content):
    return message.objects.create(conversation_id=conversation, sender_id=sender, receiver_id=receiver, content=content)

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
        print("disconnected\n")

    async def broadcast_message(self, info):
        await self.channel_layer.group_send(
            info['room_group_name'],
            {
                'type': 'send_message',
                'sent_by_user': info['sent_by_user'],
                'message': info['message']
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        conversation_id = data['conversation_id']
        sent_by_user = data['sent_by_user']
        sent_to_user = data['sent_to_user']
        sender = await get_user(sent_by_user)
        receiver = await get_user(sent_to_user)
        message = data['message']
        conversation_exists = await check_conversation_exists(conversation_id)
        conversation_obj = None
        if not conversation_exists:
            conversation_obj = await create_conversation(sender, receiver, message)
        else:
            conversation_obj = await get_conversation(conversation_id)
        await set_conversation_last_msg(conversation_obj, message)
        await create_message(conversation_obj, sender, receiver, message)
        other_user_room_group_name = f'chat_{sent_to_user}'
        await self.broadcast_message({'room_group_name': self.room_group_name, 'sent_by_user': sent_by_user, 'message': message})
        await self.broadcast_message({'room_group_name': other_user_room_group_name, 'sent_by_user': sent_by_user, 'message': message})
    
    async def send_message(self, event):
        sent_by_user = event['sent_by_user']
        message = event['message']
        await self.send(text_data=json.dumps({
            'sent_by_user': sent_by_user,
            'message': message
        }))
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from authentication.models import CustomUser
from .models import conversation, message
from django.db.models import Q
from django.utils import timezone

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
            await self.close(code=1008)
        else:
            self.user = user
            self.room_group_name = f'chat_{user.username}'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            print(f'CHANNEL_LAYER: {self.channel_name}', flush=True)
            await self.accept()

    async def disconnect(self, close_code):
        self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def broadcast_message(self, info):
        await self.channel_layer.group_send(
            info['room_group_name'],
            {
                'type': 'send_message',
                'msg_type': 'message',
                'id': info['id'],
                'conversation_id': info['conversation_id'],
                'sent_by_user': info['sent_by_user'],
                'content': info['content']
            }
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        msg_type = data['type']
        sent_by_user = data['sent_by_user']
        sent_to_user = data['sent_to_user']
        sender_obj = await get_user(sent_by_user)
        receiver_obj = await get_user(sent_to_user)
        if not sender_obj or not receiver_obj:
            await self.close(code=1008)
        message = data['content']

        # if self.user.blocked_users.filter(username=receiver_obj.username).exists() or CustomUser.objects.filter(username=receiver_obj.username).get().blocked_users.filter(username=sender_obj.username).exists():
        #     return
        if msg_type == 'message':
            conversation_id = data['conversation_id']
            conversation_exists = await check_conversation_exists(conversation_id)
            conversation_obj = None
            if not conversation_exists:
                conversation_obj = await create_conversation(sender_obj, receiver_obj, message)
            else:
                conversation_obj = await get_conversation(conversation_id)
            await set_conversation_last_msg(conversation_obj, message)
            message_obj = await create_message(conversation_obj, sender_obj, receiver_obj, message)
            other_user_room_group_name = f'chat_{sent_to_user}'
            await self.broadcast_message({'room_group_name': self.room_group_name, 'sent_by_user': sent_by_user, 'content': message, 'id': message_obj.id, 'conversation_id': conversation_obj.id})
            await self.broadcast_message({'room_group_name': other_user_room_group_name, 'sent_by_user': sent_by_user, 'content': message, 'id': message_obj.id, 'conversation_id': conversation_obj.id})

    async def send_message(self, event):
        sent_by_user = event['sent_by_user']
        message = event['content']
        timestamp = timezone.now().strftime("%A, %I:%M %p")
        id = event['id']
        conversation_id = event['conversation_id']
        msg_type = event['msg_type']
        await self.send(text_data=json.dumps({
            'msg_type': msg_type,
            'id': id,
            'conversation_id': conversation_id,
            'sent_by_user': sent_by_user,
            'content': message,
            'get_human_readable_time': timestamp
        }))
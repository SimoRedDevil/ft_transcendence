from rest_framework.authtoken.models import Token
from django.contrib.auth.models import AnonymousUser
from asgiref.sync import sync_to_async

@sync_to_async
def get_user_from_token(token_key):
    try:
        # Try to get the user from the token
        token = Token.objects.get(key=token_key)
        return token.user
    except Token.DoesNotExist:
        return AnonymousUser()

class TokenAuthMiddleware():
    def __init__(self, app):
        self.app = app
    async def __call__(self, scope, receive, send):
        headers = dict(scope['headers'])
        auth_header = headers.get(b'authorization')
        if auth_header:
            try:
                auth_token = auth_header.decode().split(' ')[1]
                scope['user'] = await get_user_from_token(auth_token)
            except IndexError:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()
        return await self.app(scope, receive, send)
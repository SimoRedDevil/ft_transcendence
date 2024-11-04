import os
import chat.routing

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from authentication.middleware import AuthRequiredMiddleware
from django.urls import path
from game.consumers import Game
from tournament.consumers import Tournament

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

websocket_urlpatterns = [
    path('ws/game/', Game.as_asgi()),
    path('ws/tournament/', Tournament.as_asgi()),
]

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ), 
})

"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os
import chat.routing

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from authentication.middleware import AuthRequiredMiddleware

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# This is the ASGI application. For basic setups, this will just be the Django app.
application = ProtocolTypeRouter({
    "http": get_asgi_application(),  # ASGI HTTP requests
    "websocket": AuthMiddlewareStack(  # Use the AuthMiddlewareStack to automatically associate users with WebSockets
        URLRouter(  # Route WebSocket requests to the ChatConsumer
            chat.routing.websocket_urlpatterns
        )
    ),  
    # You can add other protocols like WebSocket later
})
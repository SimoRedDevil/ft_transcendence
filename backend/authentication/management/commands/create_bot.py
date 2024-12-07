from django.core.management.base import BaseCommand
from authentication.models import CustomUser

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        bot_full_name = 'AlienPong Bot'
        bot_username = 'alienpong_bot'
        bot_email = 'alienpong@aliens.com'
        bot_password = 'alien123'

        if not CustomUser.objects.filter(username=bot_username).exists():
            CustomUser.objects.create_user(
                full_name=bot_full_name,
                username=bot_username,
                email=bot_email,
                password=bot_password,
                is_bot=True
            )

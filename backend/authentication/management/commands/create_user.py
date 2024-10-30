from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Create a superuser'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        username = 'admin'
        full_name = 'Aben Nei'
        email = 'aben-nei@example.com'
        password = 'aben123'

        try:
            user = User.objects.create_superuser(username=username, email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f'Superuser {username} created successfully!'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error creating superuser: {e}'))

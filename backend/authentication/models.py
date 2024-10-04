from django.contrib.auth.models import AbstractUser as BaseUser
from django.db import models

class CustomUser(BaseUser):
    full_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    tournament_name = models.CharField(max_length=50, blank=True, null=True)
    tournament_score = models.IntegerField(default=0)
    avatar_url = models.URLField(blank=True, null=True)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'full_name']  # Specify any additional required fields


    def __str__(self):
        return self.username

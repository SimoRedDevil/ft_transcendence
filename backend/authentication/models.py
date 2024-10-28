from django.contrib.auth.models import AbstractUser as BaseUser
from django.db import models


class CustomUser(BaseUser):
    full_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    tournament_name = models.CharField(max_length=50, blank=True, null=True)
    tournament_score = models.IntegerField(default=0)
    enabeld_2fa = models.BooleanField(default=False)
    twofa_secret = models.CharField(max_length=32, blank=True, null=True)
    qrcode_dir = models.CharField(max_length=100, blank=True, null=True)
    # avatar_url = models.ImageField(upload_to='../avatars', default='../avatars/default.png')
    level = models.IntegerField(default=0)
    matches = models.IntegerField(default=0)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    draws = models.IntegerField(default=0)
    profile_visited = models.IntegerField(default=0)
    friends_count = models.IntegerField(default=0)
    top_score = models.IntegerField(default=0)
    tournaments = models.IntegerField(default=0)
    online_matches = models.IntegerField(default=0)
    offline_matches = models.IntegerField(default=0)
    current_xp = models.IntegerField(default=0)
    target_xp = models.IntegerField(default=0)
    online = models.BooleanField(default=False)


    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'full_name']  # Specify any additional required fields


    def __str__(self):
        return self.username

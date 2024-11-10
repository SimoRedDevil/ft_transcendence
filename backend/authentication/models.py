from django.contrib.auth.models import AbstractUser as BaseUser
from django.db import models
from django.core.validators import RegexValidator

phone_regex = RegexValidator(
    regex=r'^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$'
)

class CustomUser(BaseUser):
    LANGUAGE_CHOICES = (
        ('en', 'English'),
        ('fr', 'French'),
        ('es', 'Spanish'),
    )
    # is_active = models.BooleanField(default=True)
    full_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, blank=True, default='06-00-00-00-00', validators=[phone_regex])
    city = models.CharField(max_length=50, blank=True, default='Khouribga')
    address = models.CharField(max_length=50, blank=True, default='1337 school')
    language = models.CharField(max_length=2, choices=LANGUAGE_CHOICES, default='en', error_messages={'invalid': 'Please select a valid language'})
    tournament_name = models.CharField(max_length=50, blank=True, null=True)
    tournament_score = models.IntegerField(default=0)
    enabeld_2fa = models.BooleanField(default=False)
    twofa_secret = models.CharField(max_length=32, blank=True, null=True)
    twofa_verified = models.BooleanField(default=False)
    qrcode_dir = models.CharField(max_length=100, blank=True, null=True)
    qrcode_path = models.CharField(max_length=100, blank=True, null=True)
    avatar_url = models.URLField(max_length=200, blank=True, null=True)
    islogged = models.BooleanField(default=False)
    social_logged = models.BooleanField(default=False)
    password_is_set = models.BooleanField(default=False)
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
    
    class Meta:
        db_table = 'users'
        db_table = 'users'
        verbose_name_plural = 'users'

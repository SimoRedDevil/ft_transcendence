from django.contrib.auth.models import AbstractUser as BaseUser
from django.db import models

class CustomUser(BaseUser):
    full_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)  # Enforce unique email

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'full_name']  # Specify any additional required fields


    def __str__(self):
        return self.username

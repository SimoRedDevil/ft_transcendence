"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 4.2.16.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path
from datetime import timedelta
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

STATIC_URL = "avatars/"

STATICFILES_DIRS = [
    BASE_DIR / "./avatars",
]

# Add a MEDIA_ROOT for qrcodes
QRCODE_URL = '/qrcodes/'
QRCODE_ROOT = os.path.join(BASE_DIR, 'authentication/qrcodes')
# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-^3knd(m=5&aq8zx$uw@qfy8^h5dnx75bkd)^k)b!nyv#$tu443'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']



# Application definition

INSTALLED_APPS = [
    'daphne',
    'channels',
    'django.contrib.admin',
    'django.contrib.auth',  # Keep this only once
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'tournament',
    'game',
    'chat',
    'rest_framework',
    'corsheaders',
    'authentication',
    'allauth',
    'rest_framework_simplejwt',
]

AUTHENTICATION_BACKENDS = [
    'allauth.account.auth_backends.AuthenticationBackend',
]

CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer'
    }
}


# SOCIALACCOUNT_PROVIDERS = {
#     'oauth2': {
#         'APP': {
#             'client_id': 'u-s4t2ud-92bd4e0625503a1a3d309256cffd60297d8692b8710fce9d6d657fe60899bfd4',
#             'secret': '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',
#             'key': '',
#         },
#         'SCOPE': ['public'],
#         'AUTH_PARAMS': {'access_type': 'offline'},
#         'METHOD': 'oauth2',
#         'AUTHORIZE_URL': 'https://api.intra.42.fr/oauth/authorize',
#         'ACCESS_TOKEN_URL': 'https://api.intra.42.fr/oauth/token',
#         'PROFILE_URL': 'https://api.intra.42.fr/v2/me',  # For getting user data
#         'REDIRECT_URI': 'http://localhost:8000/accounts/42/callback/',
#     },
# }

CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True


CSRF_COOKIE_HTTPONLY = False
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000']
CSRF_USE_SESSIONS = False  # Unless explicitly using sessions for CSRF
CSRF_COOKIE_NAME = "csrftoken"  # Ensure this matches what you're using on the client-side


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    # 'PAGE_SIZE': 1,
}
AUTH_USER_MODEL = 'authentication.CustomUser'

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),  # Short lifetime for access token
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),    # Longer lifetime for refresh token
    'ROTATE_REFRESH_TOKENS': True,                 # Rotate refresh tokens on refresh
    'BLACKLIST_AFTER_ROTATION': True,              # Blacklist old tokens
    'UPDATE_LAST_LOGIN': True,                   # Update last login on token refresh
    'BLACKLIST_AFTER_ROTATION': True,              # Blacklist old tokens
}

CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',  # Your Next.js frontend
    'http://127.0.0.1:3000',
    'https://*',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'allauth.account.middleware.AccountMiddleware', 
    'authentication.middleware.AuthRequiredMiddleware', 
    'authentication.middleware.TrailingSlashMiddleware', 
]

ROOT_URLCONF = 'backend.urls'



TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

ASGI_APPLICATION = 'backend.asgi.application'


# 42 API OAuth settings
INTRA_42_CLIENT_ID = 'u-s4t2ud-92bd4e0625503a1a3d309256cffd60297d8692b8710fce9d6d657fe60899bfd4'
INTRA_42_CLIENT_SECRET = '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'
INTRA_42_REDIRECT_URI = 'http://localhost:3000'
INTRA_42_TOKEN_URL = 'https://api.intra.42.fr/oauth/token'
INTRA_42_AUTH_URL = 'https://api.intra.42.fr/oauth/authorize'



DATABASES = {
    'default': {
        "ENGINE": "django.db.backends.postgresql",
        'NAME': 'alienpong',
        'USER': 'aghbal',
        'PASSWORD': 'aghbal123',
        'HOST': 'db',
        'PORT': '5432',
    }
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
            'OPTIONS': {
                'min_length': 8,
            }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [("redis", 6379)],
        },
    },
}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000", 
]
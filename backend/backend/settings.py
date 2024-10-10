"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 4.2.16.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-^3knd(m=5&aq8zx$uw@qfy8^h5dnx75bkd)^k)b!nyv#$tu443'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    'localhost',
]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',  # Keep this only once
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'game',
    'chat',
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',
    'authentication',
    'allauth',
    'allauth.socialaccount',
    'allauth.account',
    'authentication.providers.fortytwo',  # Your provider app
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.oauth2',
    'rest_framework_simplejwt',
]

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

SITE_ID = 1

LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 3

SOCIALACCOUNT_PROVIDERS = {
    'oauth2': {
        'APP': {
            'client_id': 'u-s4t2ud-92bd4e0625503a1a3d309256cffd60297d8692b8710fce9d6d657fe60899bfd4',
            'secret': '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',
            'key': '',
        },
        'SCOPE': ['public'],
        'AUTH_PARAMS': {'access_type': 'offline'},
        'METHOD': 'oauth2',
        'AUTHORIZE_URL': 'https://api.intra.42.fr/oauth/authorize',
        'ACCESS_TOKEN_URL': 'https://api.intra.42.fr/oauth/token',
        'PROFILE_URL': 'https://api.intra.42.fr/v2/me',  # For getting user data
        'REDIRECT_URI': 'http://localhost:8000/accounts/42/callback/',
    },
    'google': {
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    }
}

SOCIAL_AUTH_GOOGLE_OAUTH2_KEY = '386950283719-41fur79opnie0henf8sjbs3cgp22rcg4.apps.googleusercontent.com'  # Your Client ID
SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET = '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'  # Your Secret Key


CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}
AUTH_USER_MODEL = 'authentication.CustomUser'


CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',  # Your Next.js frontend
    'http://127.0.0.1:3000',
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

WSGI_APPLICATION = 'backend.wsgi.application'


# 42 API OAuth settings
INTRA_42_CLIENT_ID = 'u-s4t2ud-92bd4e0625503a1a3d309256cffd60297d8692b8710fce9d6d657fe60899bfd4'
INTRA_42_CLIENT_SECRET = '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'
INTRA_42_REDIRECT_URI = 'http://localhost:3000'
INTRA_42_TOKEN_URL = 'https://api.intra.42.fr/oauth/token'
INTRA_42_AUTH_URL = 'https://api.intra.42.fr/oauth/authorize'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': {
        "ENGINE": "django.db.backends.postgresql",
        'NAME': 'alienpong',
        'USER': 'aben-nei',
        'PASSWORD': 'aben-nei123',
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


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

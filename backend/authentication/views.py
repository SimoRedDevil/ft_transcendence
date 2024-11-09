from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework import viewsets
from django.contrib.auth import login, authenticate, logout
from .serializers import *
from .models import CustomUser
from django.http import JsonResponse
import requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import redirect
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import AccessToken
from datetime import timedelta
from rest_framework.decorators import api_view, permission_classes
from django.forms.models import model_to_dict
from authentication.twofaAuth import twofactorAuth
import pyotp
from django.http import HttpResponse
from urllib.parse import urljoin
from rest_framework_simplejwt.exceptions import TokenError
import shutil
import os
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from django.http import HttpResponseRedirect
from rest_framework_simplejwt.authentication import JWTAuthentication
import jwt
from django.utils.timezone import now



# Sign Up View
class SignUpView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = SignUpSerializer

def setTokens(response, user):
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    response.set_cookie(
        key='access',
        value=access_token,
        httponly=False,
        secure=False, 
        samesite='Lax',
    )
    return response

def delete_tokens(request, status):
    response = Response(status=status)
    response.delete_cookie('access')
    response.delete_cookie('sessionid')
    response.delete_cookie('csrftoken')
    return response

# Callback Intra View
class Intra42Callback(APIView):
    def get(self, request):
        code = request.GET.get('code')
        data = {
            'grant_type': 'authorization_code',
            'client_id': settings.INTRA_42_CLIENT_ID,
            'client_secret': settings.INTRA_42_CLIENT_SECRET,
            'code': code,
            'redirect_uri': settings.INTRA_42_REDIRECT_URI
        }
        response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
        if response.status_code != 200:
            return HttpResponseRedirect("http://localhost:3000/login")
        response_data = response.json()
        access_token = response_data['access_token']
        if not access_token:
            return HttpResponseRedirect("http://localhost:3000/login")
        user_info = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'}).json()

        if 'login' not in user_info or 'email' not in user_info:
            return HttpResponseRedirect("http://localhost:3000/login")

        try:
            user = CustomUser.objects.get(username=user_info['login'])
        except CustomUser.DoesNotExist:
            user = CustomUser.objects.create(
                username=user_info['login'],
                email=user_info['email'],
                full_name=user_info['displayname'],
                avatar_url=user_info['image']['link'],
                social_logged=True,
                islogged=True,
                online=True,
                password_is_set=False
            )

        authenticate(request, username=user.username)
        if not user.is_authenticated:
            return HttpResponseRedirect("http://localhost:3000/login")
        login(request, user)
        response = HttpResponseRedirect('http://localhost:3000')
        response = setTokens(response, user)
        user_data = Intra42UserSerializer(user).data
        response.data = user_data
        return response

# Callback Google View
class GoogleLoginCallback(APIView):
    def get(self, request):
        code = request.GET.get("code")
        if not code:
            return HttpResponseRedirect("http://localhost:3000/login")

        # Google OAuth token endpoint
        token_endpoint_url = urljoin("https://oauth2.googleapis.com", "/token")
        data = {
            "code": code,
            "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
            "client_secret": settings.GOOGLE_OAUTH_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_OAUTH_CALLBACK_URL,
            "grant_type": "authorization_code",
        }

        response = requests.post(token_endpoint_url, data=data)
        if response.status_code != 200:
            return HttpResponseRedirect("http://localhost:3000/login")

        try:
            response_data = response.json()
            access_token = response_data.get("access_token")
        except ValueError:
            return HttpResponseRedirect("http://localhost:3000/login")

        if not access_token:
            return HttpResponseRedirect("http://localhost:3000/login")
        
        # Get user info from Google
        user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        user_info_response = requests.get(user_info_url, headers=headers)
        if user_info_response.status_code != 200:
            return HttpResponseRedirect("http://localhost:3000/login")
        try:
            user_info = user_info_response.json()

            if 'sub' not in user_info or 'email' not in user_info:
                return HttpResponseRedirect("http://localhost:3000/login")
            try:
                user = CustomUser.objects.get(email=user_info['email'])
            except CustomUser.DoesNotExist:
                user = CustomUser.objects.create(
                    username=user_info['given_name'],
                    email=user_info['email'],
                    full_name=user_info['name'],
                    avatar_url=user_info['picture'],
                    ocial_logged=True,
                    islogged=True,
                    online=True,
                    password_is_set=False
                )
            authenticate(request, username=user.username)
            if not user.is_authenticated:
                return HttpResponseRedirect("http://localhost:3000/login")
            login(request, user)

            response = HttpResponseRedirect('http://localhost:3000')
            response = setTokens(response, user)
            user_data = GoogleUserSerializer(user).data
            response['X-User-Data'] = user_data
            return response
        except ValueError:
            return HttpResponseRedirect("http://localhost:3000/login")

# Login View
class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                return Response("Invalid credentials", status=status.HTTP_401_UNAUTHORIZED)
            
            user = authenticate(username=user.username, password=password)
            if user is not None:
                login(request, user)
                user.online = True
                user.islogged = True
                if not user.avatar_url:
                    user.avatar_url = 'http://localhost:8000/avatars/default.png'
                user.save()
                response = Response(status=status.HTTP_200_OK)
                response = setTokens(response, user)
                return response
            else:
                return Response("Invalid credentials", status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# get all users
class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
    serializer_class = UserSerializer
    def get_queryset(self):
        return CustomUser.objects.all()

def generate_tokens(request):
    user = request.user
    refresh = RefreshToken.for_user(user)
    res = requests.post('http://localhost:8000/api/auth/refresh/', data={'refresh': str(refresh),
    'X-CSRFToken': request.COOKIES.get('csrftoken')})
    if res.status_code != 200:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    tokens = res.json()
    access_token = tokens.get('access')
    response = Response(status=res.status_code)
    response.set_cookie(
        key='access',
        value=access_token,
        httponly=False,
        secure=False, 
        samesite='Lax',  # Optional, but recommended
    )
    user = request.user
    user_data = UserSerializer(user).data
    response.data = user_data
    return response

# get authenticated user
class AuthenticatedUserView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            acces_token = request.COOKIES.get('access')
            decoded_access_token = jwt.decode(
                acces_token,
                key=settings.SECRET_KEY,
                algorithms=["HS256"]
            )
        except jwt.ExpiredSignatureError:
            return generate_tokens(request)

        except (jwt.InvalidTokenError, jwt.DecodeError):
            return delete_tokens(request, status=status.HTTP_401_UNAUTHORIZED)

        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

# Logout View
class Logout(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.is_authenticated:
            logout(request)
            user.online = False
            user.twofa_verified = False
            user.save()
            return delete_tokens(request, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

#enable 2fa
class EnableTwoFactorView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        key, otp, qrcode_path, qrcode_dir = twofactorAuth(user.username)
        user.twofa_secret = key
        user.qrcode_dir = qrcode_dir
        user.qrcode_path = qrcode_path
        user.save()
        user.qrcode_path = qrcode_path
        return Response({'qrcode_url': user.qrcode_path}, status=status.HTTP_200_OK)

#disable 2fa
class DisableTwoFactorView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user.enabeld_2fa = False
        user.twofa_secret = None
        user.qrcode_dir = None
        if os.path.exists(str(user.qrcode_path)):
            os.remove(str(user.qrcode_path))
        user.qrcode_path = None
        user.save()
        return Response(status=status.HTTP_200_OK)

#verify 2fa
class VerifyTwoFactorView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_code = request.GET.get('code')

        if not user.twofa_secret:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.TOTP(user.twofa_secret)

        if totp.verify(user_code):
            user.enabeld_2fa = True
            user.twofa_verified = not user.twofa_verified
            user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

#get cookies
class GetCookies(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Access cookies from the request
        cookies = request.COOKIES

        # You can format the cookies as needed
        cookie_data = {key: value for key, value in cookies.items()}
        return Response({'cookies': cookie_data}, status=200)

#get qrcode for 2fa
class GetQRCodeView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if not user.twofa_secret:
            return Response({'error': '2FA is not enabled'}, status=status.HTTP_400_BAD_REQUEST)
        qr_user = user.qrcode_path.split('/')[-1]
        qrcode_path = "http://localhost:8000/qrcodes/" + qr_user
        return Response({'qrcode_url': qrcode_path}, status=status.HTTP_200_OK)

#update user Information
class UpdateUserView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def put(self, request):
        user = request.user
        data = request.data
        serializer = UpdateUserSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        updated = False
        full_name = data.get('full_name')
        if full_name and full_name != user.full_name:
            user.full_name = full_name
            updated = True
        phone_number = data.get('phone_number')
        if phone_number and phone_number != user.phone_number:
            user.phone_number = phone_number
            updated = True
        city = data.get('city')
        if city and city != user.city:
            user.city = city
            updated = True
        address = data.get('address')
        if address and address != user.address:
            user.address = address
            updated = True
        if 'new_password' in data:
            password_change_response = self.change_password(user, data)
            if password_change_response is not None:
                return password_change_response
            updated = True
        if 'language' in data:
            language_change_response = self.change_language(user, data)
            if language_change_response:
                updated = True
        if updated:
            user.save()
        user_data = UpdateUserSerializer(user).data
        return Response(user_data, status=status.HTTP_200_OK)

#change password
    def change_password(self, user, data):
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        confirm_password = data.get('confirm_password')
        if not user.social_logged:
            if not user.check_password(current_password):
                return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            if user.password_is_set:
                if not user.check_password(current_password):
                    return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        if not new_password or not confirm_password:
            return Response({'error': 'New password and confirmation are required'}, status=status.HTTP_400_BAD_REQUEST)
        if new_password == current_password:
            return Response({'error': 'New password must be different from the current password'}, status=status.HTTP_400_BAD_REQUEST)
        if new_password != confirm_password:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        if user.social_logged:
            user.password_is_set = True
        return None
    
    def change_language(self, user, data):
        language = data.get('language')
        if language:
            user.language = language
            return True
        return False

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework import viewsets
from django.contrib.auth import login, authenticate, logout
from .serializers import SignUpSerializer, LoginSerializer, UserSerializer, Intra42UserSerializer
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


INTRA_42_AUTH_URL = settings.INTRA_42_AUTH_URL

# Sign Up View
class SignUpView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = SignUpSerializer

class GenerateAuthUrl(APIView):
    def get(self, request):
        auth_url = (
            f"https://api.intra.42.fr/oauth/authorize?"
            f"client_id={settings.INTRA_42_CLIENT_ID}&redirect_uri={settings.INTRA_42_REDIRECT_URI}"
            "&response_type=code"
        )
        return redirect(auth_url)


def fillUser(user, user_info):
    user.full_name = user_info['displayname']
    user.email = user_info['email']
    user.online = True
    user.avatar_url = user_info['image']['link']
    user.islogged = True
    user.save()
    return user

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
            return Response({'error': 'Invalid code'}, status=status.HTTP_400_BAD_REQUEST)
        response_data = response.json()
        access_token = response_data['access_token']
        if not access_token:
            return Response({'error': 'Invalid access token'}, status=status.HTTP_400_BAD_REQUEST)
        user_info = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'}).json()

        user, created = CustomUser.objects.get_or_create(username=user_info['login'])
        user_data = Intra42UserSerializer(user).data
        authenticate(request, username=user_data['username'])
        login(request, user)
        user = fillUser(user, user_info)
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        response = Response(status=status.HTTP_200_OK)
        response.set_cookie(
            key='access',
            value=str(refresh.access_token),
            httponly=False,
            secure=False, 
            samesite='Lax',  # Optional, but recommended
        )
        response.set_cookie(
            key='refresh',
            value=str(refresh),
            httponly=False,
            secure=False, 
            samesite='Lax',  # Optional, but recommended
        )
        user_data = Intra42UserSerializer(user).data
        response.data = user_data
        return response


class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    callback_url = settings.GOOGLE_OAUTH_CALLBACK_URL
    client_class = OAuth2Client

from django.urls import reverse

class GoogleLoginCallback(APIView):
    def get(self, request, *args, **kwargs):
        """
        Handle Google OAuth2 callback and exchange the authorization code for tokens.
        """

        code = request.GET.get("code")
        if not code:
            return Response({"error": "Authorization code not provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Google OAuth token endpoint
        token_endpoint_url = urljoin("https://oauth2.googleapis.com", "/token")
        data = {
            "code": code,
            "client_id": settings.GOOGLE_OAUTH_CLIENT_ID,
            "client_secret": settings.GOOGLE_OAUTH_CLIENT_SECRET,
            "redirect_uri": settings.GOOGLE_OAUTH_CALLBACK_URL,
            "grant_type": "authorization_code",
        }

        # Send the POST request to get the tokens
        response = requests.post(token_endpoint_url, data=data)

        if response.status_code != 200:
            return Response({"error": "Failed to get token from Google"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Parse the response as JSON
        try:
            response_data = response.json()
            access_token = response_data.get("access_token")
        except ValueError:
            return Response({"error": "Invalid response from Google server"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        if not access_token:
            return Response({"error": "Invalid access token"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Get user info from Google
        user_info_url = "https://www.googleapis.com/oauth2/v3/userinfo"
        headers = {"Authorization": f"Bearer {access_token}"}
        user_info_response = requests.get(user_info_url, headers=headers)
        if user_info_response.status_code != 200:
            return Response({"error": "Failed to get user info from Google"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        try:
            user_info = user_info_response.json()
            user, created = CustomUser.objects.get_or_create(username=user_info['sub'])
            user_data = Intra42UserSerializer(user).data
            authenticate(request, username=user_data['username'])
            login(request, user)
            user = request.user
            user.full_name = user_info['name']
            user.email = user_info['email']
            user.username = user_info['given_name']
            user.online = True
            user.avatar_url = user_info['picture']
            user.islogged = True
            user.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            
            # Create response and set cookies
            response = HttpResponseRedirect('http://localhost:3000')
            response.set_cookie(
                key='access',
                value=str(refresh.access_token),
                httponly=False,
                secure=False, 
                samesite='Lax',  # Optional, but recommended
            )
            response.set_cookie(
                key='refresh',
                value=str(refresh),
                httponly=False,
                secure=False, 
                samesite='Lax',  # Optional, but recommended
            )
            
            # Optionally, add user data to the response if needed
            user_data = Intra42UserSerializer(user).data
            response['X-User-Data'] = user_data
            
            return response
        except ValueError:
            return Response({"error": "Invalid response from Google server"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
                user.save()
                refresh = RefreshToken.for_user(user)
                acess_token = str(refresh.access_token)
                response = Response(status=status.HTTP_200_OK)

                # Set the access and refresh tokens in cookies
                response.set_cookie(
                    key='access',
                    value=acess_token,
                    httponly=False,
                    secure=False, 
                    samesite='Lax',  # Optional, but recommended
                )
                response.set_cookie(
                    key='refresh',
                    value=str(refresh),
                    httponly=False,
                    secure=False, 
                    samesite='Lax',  # Optional, but recommended
                )

                return response
            else:
                return Response("Invalid credentials", status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ValidateTokenView(APIView):
    def get(self, request):
        access_token = request.COOKIES.get('access')
        refresh_token = request.COOKIES.get('refresh')

        if not access_token:
            return Response({'error': 'Access token not found in cookies'}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            # Validate the access token
            decoded_token = AccessToken(access_token)
            user_id = decoded_token.get('user_id')
            return Response({'valid': True, 'user_id': user_id,
                'access': access_token,
                'refresh': refresh_token
                }, status=status.HTTP_200_OK)
        except Exception:
            return Response({'valid': False, 'error': 'Invalid or expired access token'}, status=status.HTTP_401_UNAUTHORIZED)

class GenerateAccessToken(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        code = request.COOKIES.get('refresh')
        data = {
            'refresh': code,
            'X-CSRFToken': request.COOKIES.get('csrftoken')
        }
        respo = requests.post('http://0.0.0.0:8000/api/auth/refresh/', data=data)
        tokens = respo.json()
        access_token = tokens.get('access')
        refresh_token = tokens.get('refresh')
        response = Response(status=respo.status_code)
        response.set_cookie(    
            key='access',
            value=access_token,
            httponly=False,
            secure=False, 
            samesite='Lax',  # Optional, but recommended
        )
        response.set_cookie(
            key='refresh',
            value=refresh_token,
            httponly=False,
            secure=False, 
            samesite='Lax',  # Optional, but recommended
        )
        return response

    def get(self, request):
        cookies = request.COOKIES
        cookie_data = {key: value for key, value in cookies.items()}
        return Response({'cookies': cookie_data}, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
    serializer_class = UserSerializer
    def get_queryset(self):
        return CustomUser.objects.all()

def generate_tokens(request):
    res = requests.post('http://localhost:8000/api/auth/refresh/', data={'refresh': request.COOKIES.get('refresh'),
    'X-CSRFToken': request.COOKIES.get('csrftoken')})
    if res.status_code != 200:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    tokens = res.json()
    print("tokens")
    access_token = tokens.get('access')
    refresh_token = tokens.get('refresh')
    response = Response(status=res.status_code)
    response.set_cookie(
        key='access',
        value=access_token,
        httponly=False,
        secure=False, 
        samesite='Lax',  # Optional, but recommended
    )
    response.set_cookie(
        key='refresh',
        value=refresh_token,
        httponly=False,
        secure=False, 
        samesite='Lax',  # Optional, but recommended
    )
    user = request.user
    user_data = UserSerializer(user).data
    response.data = user_data
    return response

class AuthenticatedUserView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    res = None
    def get(self, request):
        user = request.user
        acces = request.COOKIES.get('access')
        if not acces:
            return generate_tokens(request)
        else:
            valid = requests.post('http://localhost:8000/api/auth/verify/', data={'token': acces})
            if valid.status_code != 200:
                return generate_tokens(request)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)


# Logout View
class Logout(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user.is_authenticated:
            # Log the user out
            logout(request)
            user.online = False
            user.islogged = False
            user.save()

            # Prepare the response and delete cookies
            response = Response(status=status.HTTP_200_OK)
            response.delete_cookie('access')
            response.delete_cookie('refresh')
            response.delete_cookie('csrftoken')
            return response
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

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
            user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class GetCookies(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Access cookies from the request
        cookies = request.COOKIES

        # You can format the cookies as needed
        cookie_data = {key: value for key, value in cookies.items()}
        return Response({'cookies': cookie_data}, status=200)

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
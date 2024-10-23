from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework import viewsets
from django.contrib.auth import login, authenticate, logout
from .serializers import SignUpSerializer, LoginSerializer, UserSerializer
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
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken


INTRA_42_AUTH_URL = settings.INTRA_42_AUTH_URL

def intra_42_login(request):
    """
    Redirects user to 42 Intra login page to authenticate.
    """
    return redirect(
        f'{INTRA_42_AUTH_URL}?client_id={settings.INTRA_42_CLIENT_ID}&redirect_uri={settings.INTRA_42_REDIRECT_URI}&response_type=code'
    )

def intra_42_callback(request):
    code = request.GET.get('code')
    # Exchange the authorization code for an access token
    token_url = settings.INTRA_42_TOKEN_URL
    data = {
        'grant_type': 'authorization_code',
        'client_id': settings.INTRA_42_CLIENT_ID,
        'client_secret': settings.INTRA_42_CLIENT_SECRET,
        'code': code,
        'redirect_uri': settings.INTRA_42_REDIRECT_URI
    }

    response = requests.post(token_url, data=data) # Send a POST request to the token URL
    if response.status_code == 200:
        # Successful token exchange
        tokens = response.json()
        access_token = tokens['access_token']
        refresh_token = tokens.get('refresh_token', None)
        # Use the access token to fetch user data from 42 API
        user_info = fetch_42_user_data(access_token)
        # Create the response
        response = JsonResponse({})
        response.set_cookie(
            key='access_token', 
            value=access_token, 
            httponly=True, 
            secure=True,  # Use secure=True in production to ensure cookies are sent over HTTPS
        )
        return response

    else:
        # Error in token exchange
        return JsonResponse({
            "error": "Failed to exchange authorization code for access token."
        }, status=400)

def fetch_42_user_data(access_token):
    """
    Fetches user data from the 42 API using the access token.
    """
    user_info_url = 'https://api.intra.42.fr/v2/me'
    headers = {
        'Authorization': f'Bearer {access_token}'
    }

    response = requests.get(user_info_url, headers=headers)

    if response.status_code == 200:
        return response.json()
    return None


# Sign Up View
class SignUpView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = SignUpSerializer

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
                user.save()
                refresh = RefreshToken.for_user(user)
                response = Response(status=status.HTTP_200_OK)

                # Set the access and refresh tokens in cookies
                response.set_cookie(
                    key='access',
                    value=str(refresh.access_token),
                    httponly=True,
                    secure=False,  # Set to True in production
                    samesite='Lax',  # Optional, but recommended
                )
                response.set_cookie(
                    key='refresh',
                    value=str(refresh),
                    httponly=True,
                    secure=False,  # Set to True in production
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
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the refresh token
            refresh = RefreshToken(refresh_token)

            # Check if the refresh token has already been blacklisted
            jti = refresh['jti']  # Extract the JWT ID from the refresh token
            if BlacklistedToken.objects.filter(token__jti=jti).exists():
                return Response({"error": "Refresh token is blacklisted"}, status=status.HTTP_401_UNAUTHORIZED)

            # Blacklist the old refresh token explicitly
            try:
                refresh.blacklist()  # Blacklist the current refresh token
            except BlacklistError:
                return Response({"error": "Could not blacklist the token"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Generate new access token and refresh token (because of ROTATE_REFRESH_TOKENS=True)
            access_token = str(refresh.access_token)
            new_refresh_token = str(RefreshToken())  # Explicitly generate a new refresh token
            response = Response(status=status.HTTP_200_OK)
            response.set_cookie(
                key='access',
                value=access_token,
                httponly=True,
                secure=False,  # Set to True in production
                samesite='Lax',  # Optional, but recommended
            )
            response.set_cookie(
                key='refresh',
                value=new_refresh_token,
                httponly=True,
                secure=False,  # Set to True in production
                samesite='Lax',  # Optional, but recommended
            )
            response.data = {
                'access': access_token,
                'refresh': new_refresh_token
            }
            return response
        except TokenError as e:
            return Response({"error": "Invalid or expired refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

    def get(self, request):
        cookies = request.COOKIES
        cookie_data = {key: value for key, value in cookies.items()}
        return Response({'cookies': cookie_data}, status=status.HTTP_200_OK)

class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
    serializer_class = UserSerializer
    def get_queryset(self):
        return CustomUser.objects.all()

class AuthenticatedUserView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = UserSerializer(user).data
        return Response(user_data, status=status.HTTP_200_OK)

# Logout View
class Logout(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self, request):
        user = request.user
        if user.is_authenticated:
            logout(request)
            user.online = False
            user.save()
            response = Response(status=status.HTTP_200_OK)
            response.delete_cookie('access')
            response.delete_cookie('refresh')
            return response
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)



class EnableTwoFactorView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    # def post(self, request):
    #     user = request.user

    #     key, otp, qrcode_path = twofactorAuth(user.username)
    #     user.twofa_secret = key
    #     user.save()
    #     user.qrcode_path = urljoin(settings.MEDIA_URL, qrcode_path)
    #     return Response({'qrcode_url': user.qrcode_path}, status=status.HTTP_200_OK)
    def get(self, request):
        user = request.user

        key, otp, qrcode_path = twofactorAuth(user.username)
        user.twofa_secret = key
        user.save()
        user.qrcode_path = urljoin(settings.MEDIA_URL, qrcode_path)
        return Response({'qrcode_url': user.qrcode_path}, status=status.HTTP_200_OK)

class DisableTwoFactorView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user.enabeld_2fa = False
        user.twofa_secret = None
        user.save()
        return Response(status=status.HTTP_200_OK)

class VerifyTwoFactorView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     user = request.user
    #     user_code = request.GET.get('code')

    #     if not user.twofa_secret:
    #         return Response(status=status.HTTP_400_BAD_REQUEST)

    #     totp = pyotp.TOTP(user.twofa_secret)

    #     if totp.verify(user_code):
    #         user.enabeld_2fa = not user.enabeld_2fa
    #         user.save()
    #         return Response(status=status.HTTP_200_OK)
    #     else:
    #         return Response(status=status.HTTP_400_BAD_REQUEST)
    def post(self, request):
        user = request.user
        user_code = request.data.get('code')

        if not user.twofa_secret:
            return Response({
                'error': 'Two-factor authentication is not enabled for this user'
            },
            status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.TOTP(user.twofa_secret)

        if totp.verify(user_code):
            user.enabeld_2fa = not user.enabeld_2fa
            user.save()
            return Response({
                'message': 'Two-factor authentication has been enabled successfully'
            },status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid two-factor authentication code',
                "totp.verify": totp.verify(user_code),
                "user_code": user_code,
            },status=status.HTTP_400_BAD_REQUEST)

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
        # EnableTwoFactorView().post(request)
        return Response({'qrcode_url': user.qrcode_path}, status=status.HTTP_200_OK)
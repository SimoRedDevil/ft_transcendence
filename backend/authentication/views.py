from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework import viewsets
from django.contrib.auth import login, authenticate
from .serializers import SignUpSerializer, LoginSerializer, UserSerializer
from .models import CustomUser
from django.http import JsonResponse
import requests
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import redirect
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
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
            # Extract the email and password
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            # Get user by email
            try:
                user = CustomUser.objects.get(email=email)
            except CustomUser.DoesNotExist:
                return Response("Invalid credentials", status=status.HTTP_401_UNAUTHORIZED)
            # Authenticate the user
            user = authenticate(username=user.username, password=password)
            if user is not None:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
                response= Response(status=status.HTTP_200_OK)
                response.set_cookie(
                 key='access_token',
                 value=str(refresh.access_token),
                 httponly=True,  # More secure as it prevents JavaScript access
                 secure=True,  # Use it in production with HTTPS
                 max_age=3600,  # Set the max age of the cookie
                 )
                return response
            else:
                return Response("Invalid credentials", status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ValidateTokenView(APIView):
    def get(self, request):
        # access_token = request.COOKIES.get('access_token')

        # if not access_token:
        #     return Response({'error': 'Access token not found in cookies'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            # Validate the access token
            decoded_token = AccessToken(access_token)
            user_id = decoded_token.get('user_id')
            return Response({'valid': True, 'user_id': user_id}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'valid': False, 'error': 'Invalid or expired access token'}, status=status.HTTP_401_UNAUTHORIZED)

class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [SessionAuthentication]
    serializer_class = UserSerializer
    def get_queryset(self):
        return CustomUser.objects.all()

class AuthenticatedUser(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_data = model_to_dict(user)
        fields_to_remove = ['password', 'groups', 'user_permissions', 'twofa_secret']
        for field in fields_to_remove:
            user_data.pop(field, None)
        return Response(user_data, status=status.HTTP_200_OK)

# class logout(APIView):
#     def get(self, request):
#         response = Response()
#         response.delete_cookie('access_token')
#         return response

class EnableTwoFactorView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     user = request.user

    #     key, otp = twofactorAuth(user.username)
    #     user.twofa_secret = key
    #     user.save()
    #     return HttpResponse(f"Generated OTP: {otp} | Key: {key}", content_type="text/plain")

    def post(self, request):
        user = request.user

        key, otp, qrcode_path = twofactorAuth(user.username)
        user.enabeld_2fa = True
        user.twofa_secret = key
        user.save()
        user.qrcode_path = urljoin(settings.MEDIA_URL, qrcode_path)
        return Response({'qrcode_url': user.qrcode_path}, status=status.HTTP_200_OK)

class VerifyTwoFactorView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user_code = request.data.get('code')

        if not user.twofa_secret:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        totp = pyotp.TOTP(user.twofa_secret)

        if totp.verify(user_code):
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
        EnableTwoFactorView().post(request)
        return Response({'qrcode_url': user.qrcode_path}, status=status.HTTP_200_OK)
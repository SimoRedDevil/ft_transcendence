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

class ProtectedResourceView(APIView):
    """
    Example view that requires authentication.
    """
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # The user is authenticated, return the protected resource
        data = {
            "message": "This is a protected resource."
        }
        return JsonResponse(data)

# 42 API Authorization URL
INTRA_42_AUTH_URL = settings.INTRA_42_AUTH_URL

def intra_42_login(request):
    """
    Redirects user to 42 Intra login page to authenticate.
    """
    return redirect(
        f'{INTRA_42_AUTH_URL}?client_id={settings.INTRA_42_CLIENT_ID}&redirect_uri={settings.INTRA_42_REDIRECT_URI}&response_type=code'
    )

@csrf_exempt
def intra_42_callback(request):
    """
    Handle the callback from 42 Intra API after the user authorizes.
    Exchanges the authorization code for an access token.
    """
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

    response = requests.post(token_url, data=data)

    if response.status_code == 200:
        # Successful token exchange
        tokens = response.json()
        access_token = tokens['access_token']
        refresh_token = tokens.get('refresh_token', None)

        # Use the access token to fetch user data from 42 API
        user_info = fetch_42_user_data(access_token)

        # Handle user login/registration in your app, e.g., create a user session
        return JsonResponse({
            "message": "Login successful",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user_info": user_info
        })

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
                return Response({"access": access_token, "refresh": str(refresh)}, status=status.HTTP_200_OK)
            else:
                return Response("Invalid credentials", status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
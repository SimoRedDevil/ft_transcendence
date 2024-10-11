from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework import viewsets
from django.contrib.auth import login, authenticate
from .serializers import SignUpSerializer, LoginSerializer, UserSerializer
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import redirect
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model
import json
from google.auth.transport import requests
from google.oauth2 import id_token
from django.conf import settings


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
        # here Successful token exchange
        tokens = response.json()
        access_token = tokens['access_token']
        refresh_token = tokens.get('refresh_token', None)

        # fetch data from api 42 using the access token
        user_info = fetch_42_user_data(access_token)

        # handle user registration and login here
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

@csrf_exempt  # Exempt from CSRF validation for simplicity in this example
def auth_google(request):
    """
    Endpoint to authenticate users with Google.
    Expects a POST request with a JSON body containing 'credential'.
    """
    if request.method == 'POST':
        try:
            # Parse the request body for the token
            body = json.loads(request.body)
            token = body.get('credential')

            # Verify the token
            idinfo = id_token.verify_oauth2_token(
                token, 
                requests.Request(), 
                settings.GOOGLE_CLIENT_ID
            )

            # Extract user information from the token
            user_email = idinfo['email']
            user_name = idinfo['name']

            # Get the user model
            User = get_user_model()

            # Get or create the user
            user, created = User.objects.get_or_create(
                email=user_email,
                defaults={'username': user_name}
            )

            # If the user is created, you can set additional fields here if needed

            # Authenticate the user
            # You may want to create a session or return a token here
            return JsonResponse({'status': 'success', 'user_id': user.id}, status=200)
        
        except ValueError as e:
            # Token is invalid or expired
            return JsonResponse({'error': str(e)}, status=403)
        except Exception as e:
            return JsonResponse({'error': 'An error occurred: ' + str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request'}, status=400)
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
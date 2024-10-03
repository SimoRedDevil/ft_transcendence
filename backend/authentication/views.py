from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from rest_framework import viewsets
from django.contrib.auth import login
from .serializers import SignUpSerializer, LoginSerializer, UserSerializer
from .models import CustomUser
from django.http import JsonResponse
import requests
# from django.http import JsonResponse
# from django.views import View
# from django.shortcuts import redirect

# def initiate_oauth(request):
#     # Set your authorization URL
#     oauth_url = f"https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-d28e9829df125623cb079f92c8a5b9008eab4cbd49465c1ab45a053590c23bea&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Faccounts%2F42%2Fcallback%2F&response_type=code"  # Adjust the scope as needed
#     return redirect(oauth_url)

# class FortyTwoOAuth2Adapter(View):
#     def get(self, request):
#         code = request.GET.get('code')
#         if code:
#             token_url = 'https://api.intra.42.fr/oauth/token'
#             data = {
#                 'grant_type': 'authorization_code',
#                 'client_id': 'u-s4t2ud-d28e9829df125623cb079f92c8a5b9008eab4cbd49465c1ab45a053590c23bea',  # Replace with your Client ID
#                 'client_secret': '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',  # Replace with your Client Secret
#                 'redirect_uri': 'http://localhost:8000/accounts/42/callback/',  # Update to your Django redirect URI
#                 'code': code,
#             }
            
#             # Make the request to get the access token
#             token_response = requests.post(token_url, data=data)
            
#             if token_response.status_code == 200:
#                 token_data = token_response.json()
#                 access_token = token_data.get('access_token')

#                 profile_url = 'https://api.intra.42.fr/v2/me'
#                 headers = {
#                     'Authorization': f'Bearer {access_token}',
#                 }
#                 profile_response = requests.get(profile_url, headers=headers)

#                 if profile_response.status_code == 200:
#                     user_data = profile_response.json()  # User data retrieved successfully
#                     return JsonResponse(user_data)  # Send user data back as JSON
#                 else:
#                     return JsonResponse({"error": "Failed to retrieve user profile.", "details": profile_response.json()}, status=400)
#             else:
#                 return JsonResponse({"error": "Failed to retrieve access token.", "details": token_response.json()}, status=400)
        
#         return JsonResponse({"error": "No code provided."}, status=400)

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
            user = serializer.validated_data
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
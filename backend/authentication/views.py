from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth import login
from .serializers import SignUpSerializer, LoginSerializer
from .models import CustomUser
from allauth.socialaccount.providers.oauth2.views import OAuth2Adapter
# from authentication.providers.fortytwo.provider import FortyTwoProvider
# from allauth.socialaccount.providers.oauth2.client import OAuth2Error

# class FortyTwoOAuth2Adapter(OAuth2Adapter):
    # provider_id = FortyTwoProvider.id
    # access_token_url = 'https://api.intra.42.fr/oauth/token'
    # authorize_url = 'https://api.intra.42.fr/oauth/authorize'
    # profile_url = 'https://api.intra.42.fr/v2/me'

    # def complete_login(self, request, app, token, response):
    #     extra_data = self.get_provider().sociallogin_from_response(request, response)
    #     return extra_data

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

from django.urls import path
from .views import *

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', UserViewSet.as_view({'get': 'list'}), name='users'),
    path('42/login/', intra_42_login, name='intra_42_login'),
    path('42/callback/', intra_42_callback, name='42_callback'),
    path('token/', ValidateTokenView.as_view(), name='get_token'),
    path('user/', AuthenticatedUserView.as_view(), name='AuthenticatedUser'),
    path('enable-2fa/', EnableTwoFactorView.as_view(), name='enable_2fa'),
    path('verify-2fa/', VerifyTwoFactorView.as_view(), name='verify_2fa'),
    path('cookies/', GetCookies.as_view(), name='get_cookies'),
    path('get-qrcode/', GetQRCodeView.as_view(), name='get-qrcode'),
    path('logout/', Logout.as_view(), name='logout'),
    path('new-access/', GenerateAccessToken.as_view(), name='new-access'),


]

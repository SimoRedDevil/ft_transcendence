from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', UserViewSet.as_view({'get': 'list'}), name='users'),
    path('42/login/', GenerateAuthUrl.as_view(), name='intra_42_login'),
    path('42/callback/', Intra42Callback.as_view(), name='42_callback'),
    path('token/', ValidateTokenView.as_view(), name='get_token'),
    path('user/', AuthenticatedUserView.as_view(), name='AuthenticatedUser'),
    path('enable-2fa/', EnableTwoFactorView.as_view(), name='enable_2fa'),
    path('disable-2fa/', DisableTwoFactorView.as_view(), name='disable_2fa'),
    path('verify-2fa/', VerifyTwoFactorView.as_view(), name='verify_2fa'),
    path('cookies/', GetCookies.as_view(), name='get_cookies'),
    path('get-qrcode/', GetQRCodeView.as_view(), name='get-qrcode'),
    path('logout/', Logout.as_view(), name='logout'),
    path('new-access/', GenerateAccessToken.as_view(), name='new-access'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    # path('refresh-access/', RefreshAccessToken.as_view(), name='refresh-access'),

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
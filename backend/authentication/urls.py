from django.urls import path
from .views import *
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenVerifyView, TokenRefreshView

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', UserViewSet.as_view({'get': 'list'}), name='users'),
    path('42/callback/', Intra42Callback.as_view(), name='42_callback'),
    path('user/', AuthenticatedUserView.as_view(), name='AuthenticatedUser'),
    path('enable-2fa/', EnableTwoFactorView.as_view(), name='enable_2fa'),
    path('disable-2fa/', DisableTwoFactorView.as_view(), name='disable_2fa'),
    path('verify-2fa/', VerifyTwoFactorView.as_view(), name='verify_2fa'),
    path('cookies/', GetCookies.as_view(), name='get_cookies'),
    path('get-qrcode/', GetQRCodeView.as_view(), name='get-qrcode'),
    path('logout/', Logout.as_view(), name='logout'),
    path('update/', UpdateUserView.as_view(), name='update'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh-access'),
    path('google/callback/', GoogleLoginCallback.as_view(), name='google_callback'),

]

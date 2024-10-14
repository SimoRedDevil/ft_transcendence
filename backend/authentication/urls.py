from django.urls import path
from .views import SignUpView, LoginView, UserViewSet, intra_42_login, intra_42_callback, ValidateTokenView, AuthenticatedUser

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', UserViewSet.as_view({'get': 'list'}), name='users'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('42/login/', intra_42_login, name='intra_42_login'),
    path('42/callback/', intra_42_callback, name='42_callback'),
    path('token/', ValidateTokenView.as_view(), name='get_token'),
    path('user/', AuthenticatedUser.as_view(), name='AuthenticatedUser'),


]

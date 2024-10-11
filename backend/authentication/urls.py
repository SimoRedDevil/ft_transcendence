from django.urls import path
from .views import SignUpView, LoginView, UserViewSet, intra_42_login, intra_42_callback, auth_google

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', UserViewSet.as_view({'get': 'list'}), name='users'),
    path('42/login/', intra_42_login, name='intra_42_login'),
    path('42/callback/', intra_42_callback, name='42_callback'),
    path('auth-google/', auth_google, name='google_callback'),

]

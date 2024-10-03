from django.urls import path
from .views import SignUpView, LoginView, UserViewSet

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('users/', UserViewSet.as_view({'get': 'list'}), name='users'),
#    path('42/callback/', FortyTwoOAuth2Adapter.as_view(), name='42_callback'),
#     path('42/', initiate_oauth, name='42_initiate'),  # This view should start the OAuth flow


]

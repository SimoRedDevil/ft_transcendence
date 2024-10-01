from django.urls import path
from .views import SignUpView, LoginView #FortyTwoOAuth2Adapter

urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    # path('callback/', FortyTwoOAuth2Adapter, name="fortytwo_callback"),
]

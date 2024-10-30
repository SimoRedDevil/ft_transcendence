from django.shortcuts import redirect
from django.utils.deprecation import MiddlewareMixin
from django.http import HttpResponsePermanentRedirect

class AuthRequiredMiddleware(MiddlewareMixin):
    """
    Middleware to check user authentication for specific views,
    excluding the login page.
    """
    def process_view(self, request, view_func, view_args, view_kwargs):
        # Define the login path
        login_path = '/login/'  # Adjust this if your login URL is different

        # Check if the requested path is the login page
        if request.path == login_path:
            return None  # Don't check authentication for the login page

        # Define other protected views, if necessary
        protected_views = [
                'chat/conversations/',
                'chat/messages/',
                'game/'
            ]

        # Check if the requested path is a protected view
        if request.path in protected_views:
            # Check if the user is authenticated
            if not request.user.is_authenticated:
                return redirect(login_path)  # Redirect to the login page



class TrailingSlashMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not request.path.endswith('/') and not request.path.startswith('/admin'):
            return HttpResponsePermanentRedirect(request.path + '/')
        response = self.get_response(request)
        return response
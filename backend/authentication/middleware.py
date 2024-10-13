from django.shortcuts import redirect
from django.utils.deprecation import MiddlewareMixin

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

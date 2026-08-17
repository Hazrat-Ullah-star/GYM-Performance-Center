from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions
from django.conf import settings

def enforce_csrf(request):
    """Enforce CSRF validation for cookie-based authentication."""
    check = CSRFCheck(get_response=lambda request: None)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})
    if reason:
        raise exceptions.PermissionDenied('CSRF Failed: %s' % reason)

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Allow header-based auth as fallback/legacy
        header = self.get_header(request)
        is_cookie = False
        if header is None:
            # Fallback to HttpOnly cookie
            cookie_name = getattr(settings, 'SIMPLE_JWT', {}).get('AUTH_COOKIE', 'access_token')
            raw_token = request.COOKIES.get(cookie_name)
            if raw_token is not None:
                is_cookie = True
        else:
            raw_token = self.get_raw_token(header)
            
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        
        # Enforce CSRF if using cookies
        if is_cookie:
            enforce_csrf(request)
            
        return self.get_user(validated_token), validated_token

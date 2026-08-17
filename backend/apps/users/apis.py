from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.conf import settings

from .serializers import (
    UserSerializer, RegisterSerializer, 
    PasswordResetRequestSerializer, PasswordResetConfirmSerializer
)
from . import services

User = get_user_model()

def set_jwt_cookies(response, access_token, refresh_token=None):
    cookie_settings = getattr(settings, 'SIMPLE_JWT', {})
    
    # Access Token Cookie
    response.set_cookie(
        key=cookie_settings.get('AUTH_COOKIE', 'access_token'),
        value=access_token,
        expires=cookie_settings.get('ACCESS_TOKEN_LIFETIME'),
        secure=cookie_settings.get('AUTH_COOKIE_SECURE', False),
        httponly=cookie_settings.get('AUTH_COOKIE_HTTP_ONLY', True),
        samesite=cookie_settings.get('AUTH_COOKIE_SAMESITE', 'Lax'),
        path=cookie_settings.get('AUTH_COOKIE_PATH', '/')
    )
    
    # Refresh Token Cookie
    if refresh_token:
        response.set_cookie(
            key=cookie_settings.get('AUTH_COOKIE_REFRESH', 'refresh_token'),
            value=refresh_token,
            expires=cookie_settings.get('REFRESH_TOKEN_LIFETIME'),
            secure=cookie_settings.get('AUTH_COOKIE_SECURE', False),
            httponly=cookie_settings.get('AUTH_COOKIE_HTTP_ONLY', True),
            samesite=cookie_settings.get('AUTH_COOKIE_SAMESITE', 'Lax'),
            path=cookie_settings.get('AUTH_COOKIE_PATH', '/')
        )

class CookieTokenObtainPairView(TokenObtainPairView):
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            set_jwt_cookies(response, access_token, refresh_token)
            # Remove tokens from response payload for security
            del response.data['access']
            if 'refresh' in response.data:
                del response.data['refresh']
            response.data['message'] = 'Successfully logged in.'
        return response

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # Inject refresh token from cookie into request data
        cookie_name = getattr(settings, 'SIMPLE_JWT', {}).get('AUTH_COOKIE_REFRESH', 'refresh_token')
        if cookie_name in request.COOKIES:
            request.data['refresh'] = request.COOKIES[cookie_name]
            
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            set_jwt_cookies(response, access_token, refresh_token)
            # Remove tokens from response payload
            del response.data['access']
            if 'refresh' in response.data:
                del response.data['refresh']
            response.data['message'] = 'Token refreshed.'
        return response

class LogoutView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    def post(self, request):
        response = Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        cookie_settings = getattr(settings, 'SIMPLE_JWT', {})
        response.delete_cookie(cookie_settings.get('AUTH_COOKIE', 'access_token'))
        response.delete_cookie(cookie_settings.get('AUTH_COOKIE_REFRESH', 'refresh_token'))
        return response


class RegisterApi(generics.CreateAPIView):
    """
    API endpoint for user registration
    POST /api/auth/register/
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Call service to send verification email
        services.send_verification_email(user)
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        user_serializer = UserSerializer(user)
        
        response = Response({
            'user': user_serializer.data,
            'message': 'Registration successful. Please check your email to verify your account.'
        }, status=status.HTTP_201_CREATED)
        
        # Set tokens in HttpOnly cookies
        set_jwt_cookies(response, str(refresh.access_token), str(refresh))
        
        return response


class CurrentUserApi(generics.RetrieveUpdateAPIView):
    """
    API endpoint to get/update current user
    GET/PATCH /api/users/me/
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email_api(request):
    """POST /api/auth/verify-email/"""
    token = request.data.get('token')
    if not token:
        return Response({'detail': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    success = services.verify_user_email(token)
    if success:
        return Response({'message': 'Email verified successfully.'})
    else:
        return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def resend_verification_api(request):
    """POST /api/auth/resend-verification/"""
    user = request.user
    if user.is_email_verified:
        return Response({'detail': 'Email is already verified.'}, status=status.HTTP_400_BAD_REQUEST)

    services.send_verification_email(user)
    return Response({'message': 'Verification email resent.'})


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request_api(request):
    """
    Request password reset email
    POST /api/auth/password-reset/
    """
    serializer = PasswordResetRequestSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    email = serializer.validated_data['email']
    services.request_password_reset(email)
        
    return Response({
        'message': 'Password reset email sent if account exists.'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm_api(request):
    """
    Confirm password reset with token
    POST /api/auth/password-reset/confirm/
    """
    serializer = PasswordResetConfirmSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    token_str = serializer.validated_data['token']
    new_password = serializer.validated_data['password']
    
    success = services.confirm_password_reset(token_str, new_password)
    if success:
        return Response({'message': 'Password has been reset successfully.'}, status=status.HTTP_200_OK)
    else:
        return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def social_login_api(request):
    """
    POST /api/auth/social/
    Accepts { "provider": "google"|"github", "token": "access_token" }
    """
    provider = request.data.get('provider')
    token = request.data.get('token')
    
    if not provider or not token:
        return Response({'detail': 'Provider and token are required'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        user = services.process_social_login(provider, token)
    except ValueError as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    user_serializer = UserSerializer(user)
    
    response = Response({
        'user': user_serializer.data,
        'message': 'Social login successful.'
    })
    
    set_jwt_cookies(response, str(refresh.access_token), str(refresh))
    return response

from django.urls import path
from . import apis

urlpatterns = [
    # Auth endpoints
    path('register/', apis.RegisterApi.as_view(), name='register'),
    path('social/', apis.social_login_api, name='social_login'),
    path('token/', apis.CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', apis.CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', apis.LogoutView.as_view(), name='logout'),
    
    # Verification & Reset
    path('verify-email/', apis.verify_email_api, name='verify_email'),
    path('resend-verification/', apis.resend_verification_api, name='resend_verification'),
    path('password-reset/', apis.password_reset_request_api, name='password-reset'),
    path('password-reset/confirm/', apis.password_reset_confirm_api, name='password-reset-confirm'),
    
    # User Profile
    path('me/', apis.CurrentUserApi.as_view(), name='current-user'),
]

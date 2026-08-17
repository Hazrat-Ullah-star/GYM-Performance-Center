"""
URL configuration for gym community project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Django Admin
    path('admin/', admin.site.urls),

    
    # API v1 (The new standard)
    path('api/v1/auth/', include('apps.users.urls')),
    path('api/v1/users/', include('apps.users.urls')),
    path('api/v1/community/', include('apps.community.urls')),
    path('api/v1/gym/', include('apps.gym.urls')),
    path('api/v1/', include('apps.core.urls')),
    
    # Legacy API (for backward compatibility with existing frontend)
    path('api/auth/', include('apps.users.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/community/', include('apps.community.urls')),
    path('api/gym/', include('apps.gym.urls')),
    path('api/', include('apps.core.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

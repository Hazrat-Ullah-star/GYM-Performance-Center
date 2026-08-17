from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.db import connection


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Health check endpoint for monitoring
    GET /api/health/
    """
    try:
        # Check database connection
        connection.ensure_connection()
        db_status = 'ok'
    except Exception as e:
        db_status = f'error: {str(e)}'
    
    return Response({
        'status': 'ok',
        'database': db_status,
    })


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """
    API root endpoint
    GET /api/
    """
    return Response({
        'message': 'Welcome to Performance Gym API',
        'version': '1.0.0',
        'endpoints': {
            'auth': {
                'register': '/api/auth/register/',
                'token': '/api/auth/token/',
                'refresh': '/api/auth/token/refresh/',
            },
            'users': {
                'me': '/api/users/me/',
            },
            'community': {
                'posts': '/api/community/posts/',
                'notifications': '/api/community/notifications/',
            },
            'health': '/api/health/',
        }
    })

from .base import *

# Override base settings for production
DEBUG = False

# Make sure these are securely configured via environment variables
ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS', default=[])
CORS_ALLOWED_ORIGINS = env.list('CORS_ALLOWED_ORIGINS', default=[])

# Add file-based rotating logs or structured JSON logging for production
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'level': 'INFO',
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
}

# ── Performance Optimisations ─────────────────────────────────────────────────

# 1. Connection Pooling (reuse DB connections for up to 1 minute instead of recreating per request)
# Note: Requires CONN_MAX_AGE support from the database backend.
DATABASES = {
    'default': env.db('DATABASE_URL', default='sqlite:///db.sqlite3')
}
DATABASES['default']['CONN_MAX_AGE'] = env.int('CONN_MAX_AGE', default=60)

# 2. Caching (Redis preferred, fallback to Local Memory)
# This powers the @method_decorator(cache_page(...)) used in the API
REDIS_URL = env('REDIS_URL', default=None)
if REDIS_URL:
    CACHES = {
        'default': {
            'BACKEND': 'django_redis.cache.RedisCache',
            'LOCATION': REDIS_URL,
            'OPTIONS': {
                'CLIENT_CLASS': 'django_redis.client.DefaultClient',
                # Ignore redis connection errors if it goes down temporarily
                'IGNORE_EXCEPTIONS': True,
            }
        }
    }
else:
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'unique-gym-cache',
        }
    }

# 3. Static & Media File Caching via WhiteNoise
# Cache static assets forever (since Vite generates unique hashes per build)
WHITENOISE_MAX_AGE = 31536000 if not DEBUG else 0
# Enable Brotli compression if available
WHITENOISE_USE_BROTLI = True 

# 4. Django Security & Performance Middleware Overrides
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_SSL_REDIRECT = env.bool('SECURE_SSL_REDIRECT', default=True)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# OWASP Recommended Security Headers
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

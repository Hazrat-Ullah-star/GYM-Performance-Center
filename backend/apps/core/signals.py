import logging
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in, user_logged_out, user_login_failed
from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from apps.core.models import AuditLog

logger = logging.getLogger(__name__)
User = get_user_model()

def get_client_ip(request):
    if not request:
        return None
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')

@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    ip = get_client_ip(request)
    ua = request.META.get('HTTP_USER_AGENT', '') if request else ''
    AuditLog.objects.create(
        user=user, action='LOGIN_SUCCESS', ip_address=ip, user_agent=ua
    )
    logger.info(f"Security: User {user.email} logged in from IP {ip}")

@receiver(user_login_failed)
def log_user_login_failed(sender, credentials, request, **kwargs):
    ip = get_client_ip(request)
    ua = request.META.get('HTTP_USER_AGENT', '') if request else ''
    
    # Try to find the user by email if provided
    email = credentials.get('email')
    user = None
    if email:
        user = User.objects.filter(email=email).first()
        
    AuditLog.objects.create(
        user=user, action='LOGIN_FAILED', ip_address=ip, user_agent=ua,
        details=f"Attempted email: {email}"
    )
    logger.warning(f"Security: Failed login attempt for {email} from IP {ip}")

@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    ip = get_client_ip(request)
    ua = request.META.get('HTTP_USER_AGENT', '') if request else ''
    AuditLog.objects.create(
        user=user, action='LOGOUT', ip_address=ip, user_agent=ua
    )
    logger.info(f"Security: User {user.email} logged out from IP {ip}")

@receiver(post_save, sender=User)
def log_user_registration(sender, instance, created, **kwargs):
    if created:
        AuditLog.objects.create(
            user=instance, action='REGISTER', 
            details=f"Registered with role {instance.role}"
        )
        logger.info(f"Security: New user registered {instance.email}")

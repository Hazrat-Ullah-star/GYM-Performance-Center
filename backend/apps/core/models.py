from django.db import models
from django.conf import settings

class AuditLog(models.Model):
    """
    OWASP A09: Security Logging and Monitoring Failures.
    Tracks critical security events like logins, logouts, failures, and registrations.
    """
    ACTION_CHOICES = (
        ('LOGIN_SUCCESS', 'Login Success'),
        ('LOGIN_FAILED', 'Login Failed'),
        ('LOGOUT', 'Logout'),
        ('REGISTER', 'User Registered'),
        ('PASSWORD_RESET', 'Password Reset'),
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='audit_logs'
    )
    action = models.CharField(max_length=50, choices=ACTION_CHOICES, db_index=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=255, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)
    details = models.TextField(blank=True, help_text="Additional context as JSON or text")

    class Meta:
        db_table = 'audit_logs'
        ordering = ['-timestamp']

    def __str__(self):
        user_display = self.user.email if self.user else "Anonymous"
        return f"[{self.timestamp:%Y-%m-%d %H:%M:%S}] {self.action} - {user_display} ({self.ip_address})"

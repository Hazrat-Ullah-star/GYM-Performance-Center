from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.crypto import get_random_string
from django.utils import timezone
import datetime
from apps.core.validators import validate_image_file

class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser
    """
    
    ROLE_CHOICES = (
        ('member', 'Member'),
        ('trainer', 'Trainer'),
        ('receptionist', 'Receptionist'),
        ('admin', 'Admin'),
    )
    
    email = models.EmailField(unique=True)
    display_name = models.CharField(max_length=100, blank=True)
    bio = models.TextField(blank=True, max_length=500)
    avatar = models.ImageField(
        upload_to='avatars/', 
        blank=True, 
        null=True,
        validators=[validate_image_file]
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member', db_index=True)
    is_email_verified = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)
    
    # Make email the primary identifier
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'users'
        ordering = ['-joined_at']
    
    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        # Set display_name to username if not provided
        if not self.display_name:
            self.display_name = self.username
        super().save(*args, **kwargs)


class EmailVerificationToken(models.Model):
    """Token for email verification upon registration"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='email_verification')
    token = models.CharField(max_length=64, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'email_verifications'

    def generate_token(self):
        self.token = get_random_string(64)
        return self.token

    def __str__(self):
        return f"Email Verification for {self.user.email}"


class PasswordResetToken(models.Model):
    """Token for password reset functionality"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_resets')
    token = models.CharField(max_length=64, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    class Meta:
        db_table = 'password_resets'

    def generate_token(self):
        self.token = get_random_string(64)
        return self.token
        
    def is_valid(self):
        # Valid for 1 hour
        return not self.is_used and self.created_at >= timezone.now() - datetime.timedelta(hours=1)

    def __str__(self):
        return f"Password Reset for {self.user.email}"

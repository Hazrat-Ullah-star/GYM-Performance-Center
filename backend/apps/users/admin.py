from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin interface for custom User model
    """
    list_display = ['email', 'username', 'display_name', 'role', 'is_staff', 'joined_at']
    list_filter = ['role', 'is_staff', 'is_active', 'joined_at']
    search_fields = ['email', 'username', 'display_name']
    ordering = ['-joined_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Profile', {'fields': ('display_name', 'bio', 'avatar', 'role')}),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Profile', {'fields': ('display_name', 'role')}),
    )

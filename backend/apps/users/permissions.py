from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == 'admin' or request.user.is_superuser))


class IsTrainerUser(permissions.BasePermission):
    """
    Allows access only to trainer users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'trainer')


class IsReceptionistUser(permissions.BasePermission):
    """
    Allows access only to receptionist users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'receptionist')


class IsAdminOrTrainer(permissions.BasePermission):
    """
    Allows access to admins or trainers.
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role in ['admin', 'trainer'] or request.user.is_superuser)
        )


class IsAdminOrReceptionist(permissions.BasePermission):
    """
    Allows access to admins or receptionists (useful for managing members/payments).
    """
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.role in ['admin', 'receptionist'] or request.user.is_superuser)
        )


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit it.
    Assumes the model instance has a `user` or `author` attribute.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Check for admin
        if request.user.role == 'admin' or request.user.is_superuser:
            return True

        # Check ownership
        if hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'author'):
            return obj.author == request.user
            
        return False

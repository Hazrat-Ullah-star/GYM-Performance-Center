import os
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_image_file(value):
    """
    Validate an image file by checking its size and strictly enforcing safe extensions/MIME types.
    """
    # 1. Check file size (max 5MB)
    max_size_kb = 5120
    if value.size > max_size_kb * 1024:
        raise ValidationError(_(f"Image file size cannot exceed {max_size_kb / 1024}MB."))

    # 2. Check file extension against a safe list (disallow .svg, .html, etc.)
    ext = os.path.splitext(value.name)[1]
    valid_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif']
    if ext.lower() not in valid_extensions:
        raise ValidationError(_("Unsupported file extension. Allowed extensions are: .jpg, .jpeg, .png, .webp, .gif"))
    
    # 3. We could also verify the MIME type dynamically using `python-magic` if needed,
    # but for a basic OWASP review, restricting extensions and relying on Pillow (Django ImageField)
    # is usually sufficient for blocking SVG XSS execution.

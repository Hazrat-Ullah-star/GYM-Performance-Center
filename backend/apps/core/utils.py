import bleach

def sanitize_html(text):
    """
    Sanitize HTML input to prevent XSS attacks.
    Allows only a very strict set of safe HTML tags (e.g. for basic formatting).
    """
    if not text:
        return text
        
    allowed_tags = ['b', 'i', 'u', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li']
    allowed_attrs = {
        'a': ['href', 'title', 'rel'],
    }
    
    # Clean the text using bleach
    cleaned_text = bleach.clean(
        text,
        tags=allowed_tags,
        attributes=allowed_attrs,
        strip=True  # Strip disallowed tags instead of escaping them
    )
    
    # Add target="_blank" and rel="noopener noreferrer" to all links for safety
    cleaned_text = bleach.linkify(cleaned_text)
    
    return cleaned_text

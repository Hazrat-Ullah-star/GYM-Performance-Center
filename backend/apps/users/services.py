from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.conf import settings
import requests
from .models import EmailVerificationToken, PasswordResetToken

User = get_user_model()

def create_user(email, username, password, display_name='', is_email_verified=False, **extra_fields):
    user = User.objects.create_user(
        email=email,
        username=username,
        password=password,
        display_name=display_name,
        is_email_verified=is_email_verified,
        **extra_fields
    )
    return user

def send_verification_email(user):
    # Delete existing and create new
    EmailVerificationToken.objects.filter(user=user).delete()
    verification = EmailVerificationToken.objects.create(user=user)
    token = verification.generate_token()
    verification.save()

    verify_link = f"{settings.SITE_URL}/verify-email?token={token}"
    send_mail(
        subject=f"Verify your email for {settings.SITE_NAME}",
        message=f"Hi {user.display_name},\n\nPlease verify your email by clicking the link below:\n{verify_link}\n\nThanks,\n{settings.SITE_NAME} Team",
        from_email=settings.SITE_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )

def verify_user_email(token: str):
    try:
        verification = EmailVerificationToken.objects.get(token=token)
        user = verification.user
        user.is_email_verified = True
        user.save()
        verification.delete()
        return True
    except EmailVerificationToken.DoesNotExist:
        return False

def request_password_reset(email: str):
    user = User.objects.filter(email=email).first()
    if user:
        reset_token = PasswordResetToken.objects.create(user=user)
        token_str = reset_token.generate_token()
        reset_token.save()
        
        reset_link = f"{settings.SITE_URL}/reset-password?token={token_str}"
        send_mail(
            subject=f"Password Reset Request - {settings.SITE_NAME}",
            message=f"Hi {user.display_name},\n\nYou requested a password reset. Click the link below to set a new password:\n{reset_link}\n\nIf you did not request this, ignore this email.",
            from_email=settings.SITE_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

def confirm_password_reset(token_str: str, new_password: str) -> bool:
    try:
        reset_token = PasswordResetToken.objects.get(token=token_str, is_used=False)
        if not reset_token.is_valid():
            return False
            
        user = reset_token.user
        user.set_password(new_password)
        user.save()
        
        reset_token.is_used = True
        reset_token.save()
        return True
    except PasswordResetToken.DoesNotExist:
        return False

def process_social_login(provider: str, token: str):
    email = None
    display_name = ''
    avatar = None
    
    if provider == 'google':
        res = requests.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={token}")
        if res.status_code != 200:
            res = requests.get(f"https://oauth2.googleapis.com/tokeninfo?access_token={token}")
            if res.status_code != 200:
                raise ValueError('Invalid Google token')
        
        data = res.json()
        email = data.get('email')
        display_name = data.get('name', '')
        avatar = data.get('picture')
        
    elif provider == 'github':
        headers = {'Authorization': f'token {token}', 'Accept': 'application/json'}
        res = requests.get('https://api.github.com/user', headers=headers)
        if res.status_code != 200:
            raise ValueError('Invalid GitHub token')
            
        data = res.json()
        email = data.get('email')
        display_name = data.get('name') or data.get('login', '')
        avatar = data.get('avatar_url')
        
        if not email:
            em_res = requests.get('https://api.github.com/user/emails', headers=headers)
            if em_res.status_code == 200:
                emails = em_res.json()
                primary = next((e['email'] for e in emails if e.get('primary')), None)
                if primary:
                    email = primary
    else:
        raise ValueError('Unsupported provider')
        
    if not email:
        raise ValueError('Could not retrieve email from provider')
        
    user = User.objects.filter(email=email).first()
    if not user:
        username = email.split('@')[0]
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1
            
        user = User.objects.create(
            email=email,
            username=username,
            display_name=display_name,
            is_email_verified=True
        )
    return user

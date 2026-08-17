# 🚀 Deployment Guide

This guide covers deploying the Performance Gym application to various cloud platforms.

## Pre-Deployment Checklist

- [ ] All tests passing (`pytest` for backend, `npm test` for frontend)
- [ ] Environment variables configured for production
- [ ] Database backups enabled
- [ ] HTTPS/SSL certificates ready
- [ ] Static and media files configured (S3 or CDN)
- [ ] Logging and monitoring set up
- [ ] Error tracking configured (Sentry, etc.)

## Platform-Specific Guides

### 1. Heroku Deployment

#### Backend (Django)

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create your-gym-backend

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SECRET_KEY="your-secure-secret-key"
heroku config:set DEBUG=False
heroku config:set DJANGO_ALLOWED_HOSTS="your-gym-backend.herokuapp.com"
heroku config:set CORS_ALLOWED_ORIGINS="https://your-gym-frontend.vercel.app"

# Add buildpack
heroku buildpacks:set heroku/python

# Create Procfile in backend/
echo "web: gunicorn config.wsgi --log-file -" > backend/Procfile

# Deploy
git subtree push --prefix backend heroku main

# Run migrations
heroku run python manage.py migrate

# Create superuser
heroku run python manage.py createsuperuser

# Collect static files
heroku run python manage.py collectstatic --noinput
```

#### Frontend (React)

**Deploy to Vercel:**

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Set environment variables in Vercel dashboard
VITE_API_URL=https://your-gym-backend.herokuapp.com/api
```

### 2. Railway Deployment

Railway provides a simpler deployment process:

1. **Connect Repository:**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from repo"
   - Select your repository

2. **Backend Service:**
   - Railway auto-detects Django
   - Add PostgreSQL plugin
   - Set environment variables in Railway dashboard
   - Deploy automatically on git push

3. **Frontend Service:**
   - Add new service from same repo
   - Set root directory to `frontend`
   - Configure build command: `npm run build`
   - Configure start command: `npm run preview`

### 3. DigitalOcean App Platform

```bash
# Create app.yaml
cat > app.yaml << EOF
name: performance-gym
services:
  - name: backend
    source:
      repo: your-repo
      branch: main
      context: backend
    buildpack: python
    run_command: gunicorn config.wsgi
    envs:
      - key: DEBUG
        value: "False"
      - key: SECRET_KEY
        scope: RUN_TIME
        type: SECRET
    databases:
      - name: postgres

  - name: frontend
    source:
      repo: your-repo
      branch: main
      context: frontend
    buildpack: node
    build_command: npm run build
    run_command: npm run preview
    envs:
      - key: VITE_API_URL
        value: \${backend.PUBLIC_URL}/api
EOF

# Deploy
doctl apps create --spec app.yaml
```

### 4. AWS Deployment (Advanced)

#### EC2 + RDS Setup

**Backend:**
```bash
# SSH into EC2 instance
ssh ubuntu@your-ec2-instance

# Install dependencies
sudo apt update
sudo apt install python3-pip python3-venv nginx postgresql-client

# Clone repo
git clone your-repo.git
cd your-repo/backend

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure environment
cp ../.env.example ../.env
nano ../.env  # Edit with production values

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic

# Install Gunicorn
pip install gunicorn

# Create systemd service
sudo nano /etc/systemd/system/gym-backend.service
```

**gym-backend.service:**
```ini
[Unit]
Description=Performance Gym Django Backend
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/home/ubuntu/your-repo/backend
Environment="PATH=/home/ubuntu/your-repo/backend/venv/bin"
ExecStart=/home/ubuntu/your-repo/backend/venv/bin/gunicorn --workers 3 --bind unix:/home/ubuntu/your-repo/backend/gym.sock config.wsgi:application

[Install]
WantedBy=multi-user.target
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /static/ {
        alias /home/ubuntu/your-repo/backend/staticfiles/;
    }

    location /media/ {
        alias /home/ubuntu/your-repo/backend/media/;
    }

    location / {
        proxy_pass http://unix:/home/ubuntu/your-repo/backend/gym.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Frontend on S3 + CloudFront:**
```bash
# Build production bundle
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Environment Variables for Production

### Backend (.env)

```env
DEBUG=False
SECRET_KEY=<generate-with-django-secret-key-generator>
DJANGO_ALLOWED_HOSTS=your-domain.com,www.your-domain.com

DATABASE_URL=postgres://user:password@host:5432/dbname

CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com

# AWS S3 (for media files)
USE_S3=True
AWS_ACCESS_KEY_ID=<your-aws-key>
AWS_SECRET_ACCESS_KEY=<your-aws-secret>
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=us-east-1

# Email (production SMTP)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=<app-specific-password>

# JWT Settings
ACCESS_TOKEN_LIFETIME_MINUTES=60
REFRESH_TOKEN_LIFETIME_DAYS=7
```

### Frontend (.env.production)

```env
VITE_API_URL=https://api.your-domain.com
```

## Database Migration Strategy

```bash
# Before deploying new version
# 1. Backup database
pg_dump DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Test migrations locally
python manage.py migrate --plan

# 3. Deploy code

# 4. Run migrations
python manage.py migrate

# 5. If issues, rollback
psql DATABASE_URL < backup_YYYYMMDD_HHMMSS.sql
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Auto-renewal (cron job is created automatically)
sudo certbot renew --dry-run
```

## Performance Optimizations

### 1. Enable Caching (Redis)

```python
# settings.py
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': os.environ.get('REDIS_URL', 'redis://127.0.0.1:6379/1'),
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
        }
    }
}
```

### 2. Database Connection Pooling

```python
# settings.py
DATABASES['default']['CONN_MAX_AGE'] = 600  # 10 minutes
```

### 3. Compress Static Files

```python
# settings.py
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

### 4. Enable Gzip Compression

```nginx
# nginx.conf
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

## Monitoring & Logging

### Sentry for Error Tracking

```bash
pip install sentry-sdk
```

```python
# settings.py
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn=os.environ.get('SENTRY_DSN'),
    integrations=[DjangoIntegration()],
    traces_sample_rate=0.1,
    send_default_pii=True
)
```

### Application Logging

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/gym/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

## Health Checks

Configure health check endpoint for load balancers:
- Endpoint: `/api/health/`
- Expected Response: `{"status": "ok", "database": "ok"}`

## Backup Strategy

### Automated Database Backups

```bash
# Cron job (daily at 2 AM)
0 2 * * * pg_dump $DATABASE_URL | gzip > /backups/gym_$(date +\%Y\%m\%d).sql.gz

# Retention: Keep last 30 days
0 3 * * * find /backups -name "gym_*.sql.gz" -mtime +30 -delete
```

### Media Files Backup (if using S3)

AWS S3 versioning is enabled by default, providing automatic backup.

## Rollback Procedure

1. **Code Rollback:**
   ```bash
   git revert HEAD
   git push origin main
   # Or use platform-specific rollback feature
   ```

2. **Database Rollback:**
   ```bash
   # Restore from backup
   psql $DATABASE_URL < backup_YYYYMMDD.sql
   ```

3. **Verify:**
   - Check health endpoint
   - Test critical user flows
   - Monitor error rates

## Cost Optimization

### Free Tier Options

- **Backend:** Railway free tier, Render free tier
- **Frontend:** Vercel, Netlify
- **Database:** Railway PostgreSQL, Supabase free tier
- **Storage:** Cloudinary free tier (10GB)

### Estimated Monthly Costs (Paid)

- **Heroku:** ~$25-50/month (Hobby dyno + PostgreSQL)
- **DigitalOcean:** ~$12-24/month (Droplet + Managed DB)
- **AWS:** ~$30-60/month (EC2 t3.micro + RDS db.t3.micro + S3)

## Security Best Practices

1. ✅ Never commit secrets to git
2. ✅ Use environment variables for all sensitive data
3. ✅ Enable HTTPS only (HSTS headers)
4. ✅ Set secure cookie flags in production
5. ✅ Keep dependencies updated (Dependabot)
6. ✅ Enable rate limiting on API endpoints
7. ✅ Configure CSP headers
8. ✅ Regular security audits

## Post-Deployment Verification

```bash
# Test API endpoints
curl https://api.your-domain.com/api/health/

# Test authentication
curl -X POST https://api.your-domain.com/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Check SSL
curl -I https://your-domain.com | grep -i "Strict-Transport-Security"

# Monitor logs
tail -f /var/log/gym/django.log
```

## Troubleshooting Common Issues

**Issue:** Static files not loading
**Solution:** Run `python manage.py collectstatic` and configure STATIC_ROOT

**Issue:** Database connection errors
**Solution:** Check DATABASE_URL, firewall rules, and connection pooling settings

**Issue:** CORS errors
**Solution:** Verify CORS_ALLOWED_ORIGINS matches frontend domain exactly

**Issue:** 502 Bad Gateway
**Solution:** Check Gunicorn is running, socket file permissions, Nginx config

---

## Need Help?

- Django deployment docs: https://docs.djangoproject.com/en/stable/howto/deployment/
- Heroku Python docs: https://devcenter.heroku.com/categories/python-support
- AWS deployment: https://aws.amazon.com/getting-started/hands-on/deploy-python-application/

Happy deploying! 🚀

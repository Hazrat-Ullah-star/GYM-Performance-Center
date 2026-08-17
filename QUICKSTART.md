# 🚀 Quick Start Guide

Get the Gym Performance Center application running in under 5 minutes!

## Prerequisites

- Python 3.10+ installed
- Node.js 18+ installed  
- PostgreSQL 14+ installed (or use Docker)
- Git installed

## Method 1: Automated Setup (Recommended for Windows)

```powershell
# Clone and navigate to project
cd d:\gym

# Run setup script
.\setup.ps1
```

The script will:
1. Create .env file
2. Set up Python virtual environment
3. Install all dependencies
4. Run database migrations
5. Optionally create superuser
6. Optionally seed demo data

## Method 2: Manual Setup

### Backend Setup

```powershell
cd backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp ../.env.example ../.env
# Edit .env with your database credentials

# Run migrations
python manage.py migrate

# Create admin user (optional)
python manage.py createsuperuser

# Seed demo data (optional)
python manage.py seed_data --users 10 --posts 20

# Start server
python manage.py runserver
```

Backend now running at: http://localhost:8000

### Frontend Setup

```powershell
# Open new terminal
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend now running at: http://localhost:5173

## Method 3: Docker (Easiest - No Setup Required)

```bash
# From project root
docker-compose up --build
```

This will start:
- PostgreSQL database (port 5432)
- Django backend (port 8000)
- React frontend (port 5173)

## Verify Installation

### Check Backend
```powershell
# Test API endpoint
curl http://localhost:8000/api/health/

# Should return: {"status": "ok", "database": "ok"}
```

### Check Frontend
Open browser: http://localhost:5173

You should see the Performance Gym homepage with:
- Hero section
- Features grid
- Testimonials
- Navigation header

## Login to Application

If you seeded demo data:

**Admin Access:**
- URL: http://localhost:8000/admin
- Email: admin@gym.com
- Password: admin123

**Regular User:**
- URL: http://localhost:5173/login
- Email: user0@gym.com
- Password: password123

Or create your own account at: http://localhost:5173/register

## Testing the Application

### Backend Tests
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pytest
```

### Frontend Tests
```powershell
cd frontend
npm test
```

### Linting
```powershell
# Backend
cd backend
flake8 .
black --check .

# Frontend
cd frontend
npm run lint
```

## Common Issues & Solutions

### Issue: Database connection error
**Solution:** 
- Make sure PostgreSQL is running
- Check DATABASE_URL in .env file
- Or use Docker: `docker-compose up db`

### Issue: Port 8000/5173 already in use
**Solution:**
```powershell
# Windows - Kill process on port
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Issue: Module not found errors (Python)
**Solution:**
```powershell
# Make sure virtual environment is activated
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Issue: Module not found errors (Node)
**Solution:**
```powershell
rm -rf node_modules package-lock.json
npm install
```

### Issue: CORS errors in browser
**Solution:** 
- Check CORS_ALLOWED_ORIGINS in backend/config/settings.py
- Should include http://localhost:5173

## Next Steps

1. **Explore the API:**
   - Visit http://localhost:8000/api/ for API documentation
   - Use tools like Postman or Thunder Client

2. **Customize the Design:**
   - Edit `frontend/tailwind.config.js` for colors/fonts
   - Modify `frontend/src/index.css` for global styles

3. **Add Features:**
   - See PROJECT_SUMMARY.md for ideas
   - Follow Django/DRF and React best practices

4. **Deploy to Production:**
   - Use Heroku, Render, Railway, or DigitalOcean
   - See README.md deployment section

## Helpful Commands

```powershell
# Backend
python manage.py makemigrations  # Create new migrations
python manage.py migrate         # Apply migrations
python manage.py createsuperuser # Create admin user
python manage.py shell           # Django shell
python manage.py seed_data       # Seed demo data

# Frontend
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint

# Docker
docker-compose up        # Start all services
docker-compose down      # Stop all services
docker-compose logs -f   # View logs
docker-compose exec backend python manage.py migrate  # Run command in container
```

## Getting Help

- Check README.md for detailed documentation
- Review PROJECT_SUMMARY.md for architecture details
- Check Django docs: https://docs.djangoproject.com
- Check React docs: https://react.dev
- Check DRF docs: https://www.django-rest-framework.org

## Success! 🎉

You now have a fully functional fullstack gym community platform running locally!

Start building amazing features! 💪

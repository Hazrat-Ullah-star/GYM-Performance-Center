# Performance-Driven Gym Community - Setup Script for Windows
# Run this with: .\setup.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Performance Gym - Setup Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ Created .env file. Please update with your settings.`n" -ForegroundColor Green
} else {
    Write-Host "✓ .env file already exists`n" -ForegroundColor Green
}

# Backend Setup
Write-Host "Setting up Django Backend..." -ForegroundColor Cyan
Write-Host "--------------------------------------"

Set-Location backend

# Create virtual environment
if (!(Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "✓ Virtual environment created`n" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install --upgrade pip
pip install -r requirements.txt

# Run migrations
Write-Host "`nRunning database migrations..." -ForegroundColor Yellow
python manage.py migrate

# Create superuser prompt
Write-Host "`nDo you want to create a superuser? (Y/N): " -ForegroundColor Yellow -NoNewline
$createSuperuser = Read-Host
if ($createSuperuser -eq "Y" -or $createSuperuser -eq "y") {
    python manage.py createsuperuser
}

# Seed database
Write-Host "`nDo you want to seed the database with demo data? (Y/N): " -ForegroundColor Yellow -NoNewline
$seedDb = Read-Host
if ($seedDb -eq "Y" -or $seedDb -eq "y") {
    python manage.py seed_data
}

Write-Host "✓ Backend setup complete!`n" -ForegroundColor Green

Set-Location ..

# Frontend Setup
Write-Host "Setting up React Frontend..." -ForegroundColor Cyan
Write-Host "--------------------------------------"

Set-Location frontend

# Install dependencies
Write-Host "Installing Node dependencies..." -ForegroundColor Yellow
npm install

Write-Host "✓ Frontend setup complete!`n" -ForegroundColor Green

Set-Location ..

# Final instructions
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "To start the development servers:`n" -ForegroundColor Yellow

Write-Host "Backend (Django):" -ForegroundColor Cyan
Write-Host "  cd backend"
Write-Host "  .\venv\Scripts\Activate.ps1"
Write-Host "  python manage.py runserver`n"

Write-Host "Frontend (React):" -ForegroundColor Cyan
Write-Host "  cd frontend"
Write-Host "  npm run dev`n"

Write-Host "Or use Docker Compose:" -ForegroundColor Cyan
Write-Host "  docker-compose up --build`n"

Write-Host "Access the application:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173"
Write-Host "  Backend API: http://localhost:8000"
Write-Host "  Admin Panel: http://localhost:8000/admin`n"

Write-Host "Demo Accounts (if seeded):" -ForegroundColor Cyan
Write-Host "  Admin: admin@gym.com / admin123"
Write-Host "  User: user0@gym.com / password123`n"

Write-Host "Happy coding! 🚀" -ForegroundColor Green

<div align="center">
  <img src="https://raw.githubusercontent.com/Hazrat-Ullah-star/portfolio/main/public/logo.png" alt="Gym Performance Center Logo" width="200" />

  # Gym Performance Center

  **An Enterprise-Grade Full-Stack Community Platform for Fitness Enthusiasts**

  [![React](https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Django](https://img.shields.io/badge/Django-4.2-green?style=flat-square&logo=django)](https://www.djangoproject.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
</div>

---

## 📖 Project Overview

**Gym Performance Center** is a comprehensive, full-stack web application designed to connect gym members, trainers, and administration under one unified digital roof. Built with scalability and security in mind, it provides a robust backend API powered by Django REST Framework and a dynamic, responsive frontend crafted with React and TypeScript.

The platform facilitates class bookings, community engagement (posts, likes, comments), trainer profiles, and seamless health tracking (BMI Calculator). It strictly adheres to **OWASP Top 10** security guidelines, featuring HttpOnly JWT authentication, CSRF protection, and rigorous rate limiting.

---

## ✨ Features

- 🔐 **Secure Authentication**: Enterprise-grade security using HttpOnly cookies for JWTs, CSRF tokens, and rate-limited endpoints.
- 🏋️ **Trainer & Class Management**: Browse available classes, view trainer profiles, and check real-time timetables.
- 📅 **Interactive Booking System**: A seamless flow allowing members to book classes and manage their schedules.
- 💬 **Community Hub**: A social feed where users can share posts, engage with comments, and leave likes.
- 📊 **Health Tools**: Built-in BMI calculator tailored for quick fitness assessments.
- 🎨 **Modern Dark UI**: A sleek, premium dark-themed dashboard and landing page with smooth Framer Motion animations.
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile viewing.

---

## 🏗️ Architecture

The project is structured as a decoupled monolithic architecture, separating the client-side presentation layer from the robust server-side business logic.

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS combined with custom UI templates
- **Routing**: React Router v6
- **State/Data Fetching**: Axios (configured with intercepts and `withCredentials`) & React Hook Form
- **Build Tool**: Vite

### Backend
- **Framework**: Django 4.2 & Django REST Framework (DRF)
- **Database**: PostgreSQL
- **Authentication**: `djangorestframework-simplejwt`
- **Security**: Custom middleware for HSTS, X-Frame-Options, NoSniff, and Bleach for HTML sanitization.
- **Static Assets**: Whitenoise for production-ready asset delivery.

---

## 📁 Folder Structure

```text
gym-performance-center/
├── frontend/                  # React + TypeScript Client
│   ├── public/                # Static assets (images, icons)
│   ├── src/
│   │   ├── api/               # Axios client and API service wrappers
│   │   ├── components/        # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── contexts/          # React Contexts (AuthContext)
│   │   ├── hooks/             # Custom React Hooks
│   │   ├── pages/             # Route-level components
│   │   ├── routes/            # Application routing configuration
│   │   └── types/             # TypeScript interface definitions
│   ├── package.json           # Frontend dependencies
│   └── vite.config.ts         # Vite configuration
│
├── backend/                   # Django REST Framework Server
│   ├── apps/
│   │   ├── core/              # Shared models, signals, and security validators
│   │   ├── users/             # Custom User model and Authentication views
│   │   └── community/         # Posts, Comments, Notifications, Likes
│   ├── config/                # Project settings (base, development, production)
│   ├── manage.py              # Django CLI
│   └── requirements.txt       # Python dependencies
│
├── docker-compose.yml         # Container orchestration
└── README.md                  # Project Documentation
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- Python (3.10+)
- PostgreSQL (14+)
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Hazrat-Ullah-star/GYM.git
cd GYM
```

### 2. Backend Setup
```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
# On Windows: .\.venv\Scripts\Activate.ps1
# On macOS/Linux: source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Create an admin account
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver 0.0.0.0:8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```
*The frontend will be available at `http://localhost:5173`.*

---

## 🔐 Environment Variables

Ensure you create the appropriate `.env` files in both the `backend` and `frontend` directories before starting the application.

**`backend/.env`**
```env
DEBUG=True
SECRET_KEY=your_super_secret_django_key_here
DATABASE_URL=postgres://user:password@localhost:5432/gym_db
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

**`frontend/.env`**
```env
VITE_API_URL=http://localhost:8000/api
```

---

## 🐳 Docker

For a streamlined setup, you can run the entire infrastructure (Frontend, Backend, and Database) using Docker Compose.

```bash
# Build and spin up the containers in detached mode
docker compose up --build -d

# View real-time logs
docker compose logs -f

# Shut down the containers
docker compose down
```

---

## 🚢 Deployment

This project is configured to be easily deployed to modern PaaS providers.

### Heroku (Backend)
1. Provision a Heroku Postgres database.
2. Set `DATABASE_URL`, `SECRET_KEY`, and `DEBUG=False` in Heroku Config Vars.
3. Push to Heroku: `git push heroku main`.
4. Run migrations: `heroku run python backend/manage.py migrate`.

### Vercel / Netlify (Frontend)
1. Connect your GitHub repository.
2. Set the build command to `npm run build` and output directory to `dist`.
3. Add the `VITE_API_URL` environment variable pointing to your deployed Heroku backend URL.

---

## 📸 Screenshots Section

*(Include relevant screenshots here to showcase your application's UI/UX. For example:)*

- **Landing Page**: Visually striking hero section with transparent navigation.
- **Dashboard**: User analytics, scheduled classes, and account settings.
- **Community Feed**: Interactive post timeline with commenting and liking.
- **Timetable**: Weekly class schedule overview.

---

## 📡 API Documentation

The backend exposes a comprehensive RESTful API. Below are a few key endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register/` | `POST` | Register a new user |
| `/api/auth/token/` | `POST` | Authenticate and receive HttpOnly JWT cookies |
| `/api/users/me/` | `GET` | Fetch the currently authenticated user's profile |
| `/api/community/posts/` | `GET` | Retrieve paginated community posts |
| `/api/community/posts/` | `POST` | Create a new community post |

*A complete Swagger/OpenAPI specification can be generated using `drf-spectacular` if integrated.*

---

## 🗺️ Future Roadmap

- [ ] **Payment Integration**: Stripe integration for seamless membership subscriptions.
- [ ] **Real-Time Chat**: WebSockets (Django Channels) for instant messaging between trainers and members.
- [ ] **Mobile Application**: React Native port for iOS and Android.
- [ ] **Advanced Analytics**: Admin dashboard for monitoring gym attendance and revenue metrics.

---

## 🤝 Contributing

We welcome contributions from the community! To contribute:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -m "Add some feature"`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Open a Pull Request.

Please ensure your code adheres to the existing style guidelines and passes all local tests before submitting a PR.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

Developed with passion by **Hazrat Ullah**.

- **Role**: Full Stack Software Engineer · Ethical Hacking Enthusiast
- **Email**: hazratullah.tk@gmail.com
- **GitHub**: [@Hazrat-Ullah-star](https://github.com/Hazrat-Ullah-star)
- **LinkedIn**: [Hazrat Ullah](https://www.linkedin.com/in/hazrat-ullah/)
- **Facebook**: [Hazrat Ullah](https://www.facebook.com/profile.php?id=100084617071521)
- **Portfolio**: [portfolio-eta-lac-hwnim1scpy.vercel.app](https://portfolio-eta-lac-hwnim1scpy.vercel.app)

> © 2018–present Gym Performance Center. All rights reserved.

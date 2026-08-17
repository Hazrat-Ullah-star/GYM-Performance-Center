import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import TemplateLayout from './components/layout/TemplateLayout'
import ProtectedRoute from './components/ProtectedRoute.tsx'

// ── Page loader spinner shown while lazy chunks are fetched ───────────────────
const PageLoader = () => (
  <div
    style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <div
      className="spinner-border text-warning"
      role="status"
      style={{ width: 40, height: 40 }}
    >
      <span className="visually-hidden">Loading…</span>
    </div>
  </div>
)

// ── Lazy-loaded pages — Vite creates a separate chunk per import() ─────────────
const HomeTemplate     = lazy(() => import('./pages/HomeTemplate'))
const Dashboard        = lazy(() => import('./pages/Dashboard'))
const Classes          = lazy(() => import('./pages/Classes'))
const Trainers         = lazy(() => import('./pages/Trainers'))
const ClassTimetable   = lazy(() => import('./pages/ClassTimetable'))
const BmiCalculator    = lazy(() => import('./pages/BmiCalculator'))
const AboutUs          = lazy(() => import('./pages/AboutUs'))
const Contact          = lazy(() => import('./pages/Contact'))
const Gallery          = lazy(() => import('./pages/Gallery'))
const Services         = lazy(() => import('./pages/Services'))
const Terms            = lazy(() => import('./pages/Terms'))
const Privacy          = lazy(() => import('./pages/Privacy'))
const Community        = lazy(() => import('./pages/Community'))

// Auth pages share an "auth" chunk via magic comment
const Login           = lazy(() => import(/* webpackChunkName: "auth" */ './pages/auth/Login'))
const Register        = lazy(() => import(/* webpackChunkName: "auth" */ './pages/auth/Register'))
const ForgotPassword  = lazy(() => import(/* webpackChunkName: "auth" */ './pages/auth/ForgotPassword'))
const ResetPassword   = lazy(() => import(/* webpackChunkName: "auth" */ './pages/auth/ResetPassword'))
const VerifyEmail     = lazy(() => import(/* webpackChunkName: "auth" */ './pages/auth/VerifyEmail'))

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Template-based routes */}
            <Route element={<TemplateLayout />}>
              <Route path="/"               element={<HomeTemplate />} />
              <Route path="/about"          element={<AboutUs />} />
              <Route path="/classes"        element={<Classes />} />
              <Route path="/services"       element={<Services />} />
              <Route path="/trainers"       element={<Trainers />} />
              <Route path="/timetable"      element={<ClassTimetable />} />
              <Route path="/bmi-calculator" element={<BmiCalculator />} />
              <Route path="/contact"        element={<Contact />} />
              <Route path="/gallery"        element={<Gallery />} />
              <Route path="/login"          element={<Login />} />
              <Route path="/register"       element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email"   element={<VerifyEmail />} />
              <Route path="/terms"          element={<Terms />} />
              <Route path="/privacy"        element={<Privacy />} />
              <Route path="/community"      element={<Community />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  )
}

export default App

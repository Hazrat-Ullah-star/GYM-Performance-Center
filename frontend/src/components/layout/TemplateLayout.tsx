import React, { useEffect, useState, useRef } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Footer } from './Footer'
import { NotificationsDropdown } from './NotificationsDropdown'
import { SITE } from '@/config/owner'
import { Menu, X, Search, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react'

const TemplateLayout: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isSticky, setIsSticky] = useState(location.pathname !== '/')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [exploreOpen, setExploreOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Make header sticky on scroll; overlay (transparent) only at top of home page
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/') {
        setIsSticky(window.scrollY > 20)
      } else {
        setIsSticky(true)
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [location.pathname])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
    setExploreOpen(false)
  }, [location.pathname])

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  // Close mobile menu on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const isActive = (path: string) => location.pathname === path ? 'active' : ''
  const homeLink = user ? '/dashboard' : '/'

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const term = searchTerm.trim()
    if (term.length > 0) {
      navigate(`/classes?search=${encodeURIComponent(term)}`)
    }
    setSearchOpen(false)
    setSearchTerm('')
  }

  const navLinks = [
    { to: homeLink, label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/classes', label: 'Classes' },
    { to: '/trainers', label: 'Our Team' },
    { to: '/community', label: 'Community' },
    { to: '/contact', label: 'Contact' },
  ]

  const exploreLinks = [
    { to: '/timetable', label: 'Timetable' },
    { to: '/bmi-calculator', label: 'BMI Calculator' },
    { to: '/gallery', label: 'Gallery' },
    { to: '/services', label: 'Services' },
    ...(user ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
  ]

  return (
    <>
      {/* Header */}
      <header className={`header-section ${isSticky ? 'scrolled' : 'overlay'}`}>
        <div className="container-fluid px-3 px-lg-4">
          <div className="d-flex align-items-center justify-content-between" style={{ minHeight: '68px' }}>
            {/* Logo */}
            <Link to={homeLink} className="d-inline-flex align-items-center gap-2">
              <img src="/img/logo.png" alt={SITE.name} style={{ height: '40px' }} />
            </Link>

            {/* Desktop Nav */}
            <nav className="d-none d-lg-flex align-items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link-item ${isActive(link.to)}`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Explore Dropdown */}
              <div
                className="position-relative"
                onMouseEnter={() => setExploreOpen(true)}
                onMouseLeave={() => setExploreOpen(false)}
              >
                <button
                  className="nav-link-item d-flex align-items-center gap-1 border-0 bg-transparent"
                  onClick={() => setExploreOpen((v) => !v)}
                  aria-expanded={exploreOpen}
                >
                  Explore <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: exploreOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                </button>
                {exploreOpen && (
                  <ul
                    className="position-absolute list-unstyled mb-0 rounded-3 py-2"
                    style={{
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#0f1419',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                      minWidth: '180px',
                      zIndex: 1000,
                    }}
                  >
                    {exploreLinks.map((link) => (
                      <li key={link.to}>
                        <Link
                          to={link.to}
                          className="d-block px-4 py-2 text-secondary text-decoration-none hover-orange"
                          style={{ fontSize: '14px', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(243,97,0,0.1)';
                            e.currentTarget.style.color = '#f36100';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '';
                            e.currentTarget.style.color = '';
                          }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </nav>

            {/* Right Side Controls */}
            <div className="d-flex align-items-center gap-2">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="border-0 bg-transparent d-flex align-items-center justify-content-center rounded-circle"
                style={{ width: '38px', height: '38px', background: 'rgba(243,97,0,0.1)', color: '#f36100', transition: 'all 0.2s' }}
                aria-label="Search"
              >
                <Search size={16} />
              </button>

              {/* Auth Controls */}
              {user ? (
                <div className="d-flex align-items-center gap-2">
                  <NotificationsDropdown />
                  <Link
                    to="/dashboard"
                    className="d-none d-sm-inline-flex align-items-center gap-1 g-btn-primary py-2 px-3 text-sm"
                    style={{ borderRadius: '20px' }}
                  >
                    <LayoutDashboard size={14} /> {user.display_name?.split(' ')[0] || 'Dashboard'}
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="d-none d-md-flex g-btn-outline align-items-center gap-1 py-2 px-3 text-sm"
                    style={{ borderRadius: '20px' }}
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="g-btn-primary py-2 px-4 text-sm d-none d-sm-inline-flex" style={{ borderRadius: '25px' }}>
                  Join Now
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="d-flex d-lg-none border-0 bg-transparent align-items-center justify-content-center rounded-circle"
                style={{ width: '40px', height: '40px', background: 'rgba(255,255,255,0.06)', color: '#fff' }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMobileOpen(false)}
            className="position-fixed"
            style={{ inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 998, backdropFilter: 'blur(4px)' }}
          />
          {/* Drawer */}
          <div
            className="position-fixed d-flex flex-column gap-1 py-4 px-3 overflow-auto"
            style={{
              top: 0, right: 0, bottom: 0,
              width: 'min(300px, 85vw)',
              background: '#0f1419',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              zIndex: 999,
              boxShadow: '-10px 0 40px rgba(0,0,0,0.6)',
            }}
          >
            {/* Close + Brand */}
            <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom border-secondary border-opacity-10">
              <img src="/img/logo.png" alt={SITE.name} style={{ height: '34px' }} />
              <button
                onClick={() => setMobileOpen(false)}
                className="border-0 bg-transparent text-secondary d-flex"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Nav Links */}
            {[...navLinks, ...exploreLinks].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`d-block px-3 py-2 rounded-3 text-decoration-none fw-semibold mobile-nav-link ${location.pathname === link.to ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: '15px', transition: 'all 0.15s' }}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-top border-secondary border-opacity-10 mt-2 pt-3">
              {user ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="w-100 btn text-white fw-bold rounded-pill"
                  style={{ background: 'rgba(243,97,0,0.15)', border: '1px solid rgba(243,97,0,0.3)' }}
                >
                  <LogOut size={14} className="me-2" /> Sign Out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="d-block text-center text-white fw-bold rounded-pill py-2"
                  style={{ background: '#f36100' }}
                  onClick={() => setMobileOpen(false)}
                >
                  Join Now
                </Link>
              )}
            </div>
          </div>
        </>
      )}

      {/* Global Search Overlay */}
      {searchOpen && (
        <div
          className="position-fixed d-flex align-items-center justify-content-center"
          style={{ inset: 0, background: 'rgba(8,12,16,0.95)', zIndex: 1001, backdropFilter: 'blur(20px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className="w-100 px-3" style={{ maxWidth: '640px' }}>
            <button
              onClick={() => setSearchOpen(false)}
              className="position-absolute top-0 end-0 m-4 border-0 bg-transparent text-secondary d-flex"
              style={{ fontSize: '28px' }}
              aria-label="Close search"
            >
              <X size={28} />
            </button>
            <form onSubmit={onSearchSubmit}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search classes, trainers, services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-100 bg-transparent text-white border-0 border-bottom text-center outline-none"
                style={{
                  fontSize: '28px',
                  borderBottomColor: '#f36100',
                  borderBottomWidth: '2px',
                  borderBottomStyle: 'solid',
                  paddingBottom: '12px',
                  letterSpacing: '0.5px',
                }}
              />
            </form>
            <p className="text-secondary text-center text-sm mt-3">Press Enter to search, Escape to close</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`site-body ${(location.pathname !== '/' || isSticky) ? 'with-offset' : ''}`}>
        <Outlet />
      </div>

      {/* Footer */}
      <Footer />

      <style>{`
        .site-body {
          background: #080c10;
          min-height: 100vh;
        }
        .site-body.with-offset {
          padding-top: 90px;
        }
        .spad { padding-top: 80px !important; padding-bottom: 80px !important; }

        .header-section {
          left: 0; top: 0; width: 100%;
          z-index: 997;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .header-section.overlay {
          background: rgba(8, 12, 16, 0.4) !important;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          position: absolute;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .header-section.scrolled {
          position: fixed;
          background: rgba(8, 12, 16, 0.92) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 6px 0;
          border-bottom: 1px solid rgba(243, 97, 0, 0.2);
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }

        .nav-link-item {
          color: #e2e8f0 !important;
          font-weight: 600;
          font-size: 15px;
          letter-spacing: 0.3px;
          padding: 6px 14px;
          border-radius: 8px;
          text-decoration: none;
          transition: color 0.2s ease, background 0.2s ease;
          cursor: pointer;
        }
        .nav-link-item.active,
        .nav-link-item:hover {
          color: #f36100 !important;
          background: rgba(243, 97, 0, 0.08);
        }

        .mobile-nav-link {
          color: #94a3b8;
        }
        .mobile-nav-link.active,
        .mobile-nav-link:hover {
          color: #f36100;
          background: rgba(243, 97, 0, 0.1);
        }

        .hover-orange:hover { color: #f36100 !important; }

        .social-btn {
          width: 38px; height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .social-btn:hover {
          background: #f36100;
          color: #fff;
          border-color: #f36100;
          transform: translateY(-3px);
          box-shadow: 0 4px 14px rgba(243, 97, 0, 0.4);
        }
      `}</style>
    </>
  )
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jQuery: any
  }
}

export default TemplateLayout

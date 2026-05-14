import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BookOpen, ShieldCheck, LogOut, Menu, X } from 'lucide-react';

import AdminHome from './admin/AdminHome';
import CourseList from './admin/CourseList';
import CourseCreate from './admin/CourseCreate';
import CourseEditor from './admin/CourseEditor';
import AccessManager from './admin/AccessManager';
import StudentManager from './admin/StudentManager';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 900) {
        setMobileMenu(false); // Close mobile menu when expanding to desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 900;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: Users },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Access Manager', path: '/admin/access', icon: ShieldCheck }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg,#0f172a 0%, #111827 45%, #1e293b 100%)',
        position: 'relative'
      }}
    >
      {/* Mobile Backdrop Overlay */}
      {isMobile && mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 999,
            animation: 'slideUpFadeIn 0.3s ease'
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          padding: '1.75rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          position: isMobile ? 'fixed' : 'relative',
          height: '100vh',
          zIndex: 1000,
          left: 0,
          top: 0,
          transform: isMobile ? (mobileMenu ? 'translateX(0)' : 'translateX(-100%)') : 'none',
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: (isMobile && mobileMenu) ? '4px 0 24px rgba(0,0,0,0.5)' : 'none'
        }}
      >
        {/* Branding */}
        <div style={{ marginBottom: '2.5rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: '#fff',
                overflow: 'hidden',
                marginBottom: '1rem',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}
            >
              <img
                src="logo.png"
                alt="CodeBaby"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '8px'
                }}
              />
            </div>

            <h2
              style={{
                color: '#fff',
                fontSize: '1.4rem',
                marginBottom: '.3rem',
                fontWeight: '800',
                letterSpacing: '-0.5px'
              }}
            >
              CodeBaby Admin
            </h2>

            <p
              style={{
                color: '#94a3b8',
                fontSize: '.85rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                fontWeight: 600
              }}
            >
              Learn • Build • Grow
            </p>
          </div>

          {/* Close button for mobile sidebar */}
          {isMobile && (
            <button
              onClick={() => setMobileMenu(false)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '.5rem'
          }}
        >
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenu(false)}
                style={{
                  textDecoration: 'none',
                  padding: '1rem 1.25rem',
                  borderRadius: '14px',
                  color: active ? '#fff' : '#cbd5e1',
                  background: active
                    ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                    : 'transparent',
                  fontWeight: active ? '600' : '500',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: active ? '0 8px 20px rgba(59, 130, 246, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#cbd5e1';
                  }
                }}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} style={{ opacity: active ? 1 : 0.7 }} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div style={{ marginTop: 'auto' }}>
          <div
            style={{
              padding: '1rem',
              borderRadius: '16px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              transition: 'background 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: user?.profile_pic_url 
                  ? 'transparent' 
                  : 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.1rem',
                fontWeight: '800',
                overflow: 'hidden',
                border: '2px solid rgba(255,255,255,0.1)',
                flexShrink: 0
              }}
            >
              {user?.profile_pic_url ? (
                <img 
                  src={(user.profile_pic_url.startsWith('http') || user.profile_pic_url.startsWith('data:')) ? user.profile_pic_url : `${import.meta.env.VITE_API_URL}${user.profile_pic_url}`} 
                  alt="Admin" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                user?.username?.[0]?.toUpperCase() || 'A'
              )}
            </div>

            <div style={{ minWidth: 0 }}>
              <p
                style={{
                  color: '#94a3b8',
                  fontSize: '.75rem',
                  marginBottom: '.1rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                Logged in as
              </p>

              <strong 
                style={{ 
                  color: '#fff', 
                  fontSize: '.95rem',
                  display: 'block',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {user?.username || 'Admin'}
              </strong>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '1rem',
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.borderColor = 'transparent';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
              e.currentTarget.style.color = '#ef4444';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflowY: 'auto'
        }}
      >
        {/* Topbar */}
        <div
          className="premium-glass"
          style={{
            padding: '1rem 2rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            borderLeft: 'none',
            borderRight: 'none',
            borderTop: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.7)',
            position: 'sticky',
            top: 0,
            zIndex: 50
          }}
        >
          <div>
            <h1
              style={{
                color: '#fff',
                fontSize: '1.5rem',
                fontWeight: '800',
                letterSpacing: '-0.5px'
              }}
            >
              Welcome back, Admin
            </h1>

            <p
              style={{
                color: '#94a3b8',
                fontSize: '.9rem',
                marginTop: '4px'
              }}
            >
              Manage students, courses and access controls
            </p>
          </div>

          {/* Mobile Menu */}
          {isMobile && (
            <button
              onClick={() => setMobileMenu(true)}
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                padding: '0.6rem',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            >
              <Menu size={24} />
            </button>
          )}
        </div>

        {/* Page Content */}
        <main
          style={{
            padding: isMobile ? '1rem' : '2rem',
            flex: 1
          }}
        >
          <Routes>
            <Route path="/" element={<AdminHome />} />
            <Route path="/students" element={<StudentManager />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/create" element={<CourseCreate />} />
            <Route path="/courses/:courseId/edit" element={<CourseEditor />} />
            <Route path="/access" element={<AccessManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
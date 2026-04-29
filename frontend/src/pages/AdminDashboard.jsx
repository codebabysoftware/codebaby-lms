import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Students', path: '/admin/students' },
    { name: 'Courses', path: '/admin/courses' },
    { name: 'Access Manager', path: '/admin/access' }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background:
          'linear-gradient(135deg,#0f172a 0%, #111827 45%, #1e293b 100%)'
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: mobileMenu ? '260px' : '260px',
          maxWidth: '100%',
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(16px)',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          padding: '1.5rem',
          display: window.innerWidth < 900 ? (mobileMenu ? 'flex' : 'none') : 'flex',
          flexDirection: 'column',
          position: window.innerWidth < 900 ? 'fixed' : 'relative',
          height: '100vh',
          zIndex: 1000,
          left: 0,
          top: 0
        }}
      >
        {/* Branding */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#fff',
              overflow: 'hidden',
              marginBottom: '1rem'
            }}
          >
            <img
              src="logo.png"
              alt="CodeBaby"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '6px'
              }}
            />
          </div>

          <h2
            style={{
              color: '#fff',
              fontSize: '1.3rem',
              marginBottom: '.3rem',
              fontWeight: '800'
            }}
          >
            CodeBaby Admin
          </h2>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '.85rem'
            }}
          >
            Learn • Build • Grow
          </p>
        </div>

        {/* Nav */}
        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '.7rem'
          }}
        >
          {navItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenu(false)}
                style={{
                  textDecoration: 'none',
                  padding: '.95rem 1rem',
                  borderRadius: '14px',
                  color: active ? '#fff' : '#cbd5e1',
                  background: active
                    ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                    : 'rgba(255,255,255,0.03)',
                  fontWeight: active ? '700' : '500',
                  transition: '0.3s ease'
                }}
              >
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
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.04)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: user?.profile_pic_url 
                  ? 'transparent' 
                  : 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1rem',
                fontWeight: '800',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.1)',
                flexShrink: 0
              }}
            >
              {user?.profile_pic_url ? (
                <img 
                  src={user.profile_pic_url.startsWith('http') ? user.profile_pic_url : `${import.meta.env.VITE_API_URL}${user.profile_pic_url}`} 
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
                  marginBottom: '.1rem'
                }}
              >
                Logged in as
              </p>

              <strong 
                style={{ 
                  color: '#fff', 
                  fontSize: '.9rem',
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
              border: 'none',
              padding: '1rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg,#ef4444,#dc2626)',
              color: '#fff',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Section */}
      <div
        style={{
          flex: 1,
          minWidth: 0
        }}
      >
        {/* Topbar */}
        <div
          style={{
            padding: '1.2rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255,255,255,0.02)',
            backdropFilter: 'blur(12px)',
            position: 'sticky',
            top: 0,
            zIndex: 50
          }}
        >
          <div>
            <h1
              style={{
                color: '#fff',
                fontSize: '1.35rem',
                fontWeight: '800'
              }}
            >
              Welcome back, Admin
            </h1>

            <p
              style={{
                color: '#94a3b8',
                fontSize: '.85rem'
              }}
            >
              Manage students, courses and access controls
            </p>
          </div>

          {/* Mobile Menu */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            style={{
              display: window.innerWidth < 900 ? 'block' : 'none',
              border: 'none',
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              padding: '.7rem 1rem',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
        </div>

        {/* Page Content */}
        <main
          style={{
            padding: '1.5rem'
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
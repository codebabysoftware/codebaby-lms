import { useContext, useState, useEffect, useCallback } from 'react';
import {
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import CourseViewer from './student/CourseViewer';
import ProfileSettings from './student/ProfileSettings';

// Hooks
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

// Sub-components
function SidebarLink({ to, active, label, icon, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="nav-link"
      style={{
        padding: '1rem',
        textDecoration: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '0.95rem',
        color: active ? '#fff' : 'var(--text-muted)',
        background: active ? 'rgba(255,255,255,0.05)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        borderLeft: active ? '4px solid var(--accent-secondary)' : '4px solid transparent',
        transition: 'all 0.2s ease'
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{icon}</span>
      {label}
    </Link>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="premium-glass" style={{ padding: '2rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '3rem', opacity: 0.1 }}>{icon}</div>
      <div style={{ width: '40px', height: '4px', borderRadius: '10px', background: color, marginBottom: '1.2rem' }} />
      <h2 style={{ fontSize: '3rem', fontWeight: '900', color: '#fff', marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>{value}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</p>
    </div>
  );
}

function StudentLibrary({ user, courses, analytics, loading }) {
  if (loading) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="shimmer-bg" style={{ width: '200px', height: '20px', borderRadius: '10px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'slideUpFadeIn 0.6s ease-out' }}>
      {/* Hero Section */}
      <div
        style={{
          position: 'relative',
          height: '60vh',
          minHeight: '450px',
          width: '100%',
          marginBottom: '3rem',
          borderRadius: '24px',
          overflow: 'hidden',
          background: 'linear-gradient(to right, #050505 20%, transparent 90%), url("https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop") center/cover',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ position: 'absolute', bottom: '15%', left: '5%', maxWidth: '700px', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.5rem' }}>
            {user?.profile_pic_url && (
              <img
                src={(user.profile_pic_url.startsWith('http') || user.profile_pic_url.startsWith('data:')) ? user.profile_pic_url : `${import.meta.env.VITE_API_URL}${user.profile_pic_url}`}
                alt="Profile"
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  border: '2px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
                }}
              />
            )}
            <div>
              <span style={{ color: 'var(--accent-secondary)', fontWeight: '800', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Personalized Portal</span>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '-2px', lineHeight: '0.9' }}>
                Welcome Back<br />
              </h1>
            </div>
          </div>

          <h2 style={{ fontSize: '1.8rem', fontWeight: '600', color: '#e5e5e5', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>
            Hey , <span className="text-gradient">{user?.first_name || user?.username}</span>
          </h2>

          <p style={{ color: '#a3a3a3', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '550px' }}>
            Elevate your Technical skills with CodeBaby Software's world-class curriculum. Your next breakthrough starts here.
          </p>

          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <button className="btn-premium">
              <span>▶</span> Play Last Lesson
            </button>
            <button className="btn-secondary-premium">
              ⓘ Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        <StatCard title="Active Courses" value={analytics?.total_enrollments || 0} icon="📚" color="linear-gradient(135deg, #3b82f6, #2563eb)" />
        <StatCard title="Lessons Mastered" value={analytics?.total_lesson_unlocks || 0} icon="⚡" color="linear-gradient(135deg, #10b981, #059669)" />
      </div>

      {/* Recommendations Section */}
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', padding: '0 0.5rem' }}>
          <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
            Recommended for You
          </h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: '600' }}>View All →</span>
        </div>

        {courses.length === 0 ? (
          <div className="premium-glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '24px' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No courses assigned yet. Your premium journey is about to begin.</p>
          </div>
        ) : (
          <div
            className="netflix-slider"
            style={{
              display: 'flex',
              gap: '1.5rem',
              overflowX: 'auto',
              padding: '1rem 0.5rem 2rem 0.5rem',
            }}
          >
            {courses.map((c) => (
              <Link
                key={c.id}
                className="netflix-card"
                to={`/student/courses/${c.id}`}
                style={{
                  minWidth: '340px',
                  height: '220px',
                  borderRadius: '20px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  textDecoration: 'none',
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {!c.is_unlocked_overall && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                    <span style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.1)', borderRadius: '99px', border: '1px solid rgba(255,255,255,0.2)' }}>🔒 Locked</span>
                  </div>
                )}

                <div style={{ height: '65%', background: 'linear-gradient(135deg, #111, #222)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                  {(c.thumbnail_base64 || c.thumbnail) ? (
                    <img
                      src={c.thumbnail_base64 || `${import.meta.env.VITE_API_URL}${c.thumbnail}`}
                      alt={c.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <>
                      <div style={{ position: 'absolute', opacity: 0.1, fontSize: '6rem', fontWeight: '900', color: '#fff', whiteSpace: 'nowrap' }}>CODEBABY</div>
                      <span style={{ color: 'var(--accent-secondary)', fontSize: '1.4rem', fontWeight: '900', zIndex: 1, letterSpacing: '4px' }}>CORE PROGRAM</span>
                    </>
                  )}
                </div>

                <div style={{ padding: '1.2rem', background: '#111', height: '35%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.4rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <span style={{ color: '#46d369', fontSize: '0.85rem', fontWeight: '800' }}>98% Match</span>
                    <span style={{ color: '#aaa', fontSize: '0.85rem', fontWeight: '600' }}>{c.modules?.length || 0} Modules</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { width } = useWindowSize();
  const [mobileMenu, setMobileMenu] = useState(false);

  // Data State lifted to parent to prevent flickering on route change
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      };
      const [statsRes, coursesRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/api/student/analytics/`, { headers }),
        fetch(`${import.meta.env.VITE_API_URL}/api/student-courses/`, { headers })
      ]);
      if (statsRes.ok && coursesRes.ok) {
        setAnalytics(await statsRes.json());
        setCourses(await coursesRes.json());
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isMobile = width < 900;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside
        className={`sidebar-nav ${mobileMenu ? 'active' : ''}`}
        style={{
          width: '280px',
          padding: '2rem 1.5rem',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          position: isMobile ? 'fixed' : 'sticky',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1000,
        }}
      >
        <div style={{ marginBottom: '3rem', padding: '0 1rem' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-1px' }}>
            CODE<span style={{ color: 'var(--accent-secondary)' }}>BABY</span>
          </h1>
        </div>

        <div style={{ marginBottom: '3rem', padding: '0 1rem' }}>
          <div style={{ position: 'relative', width: '80px', height: '80px', marginBottom: '1.2rem' }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '24px', background: 'linear-gradient(135deg, #222, #111)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
              {user?.profile_pic_url ? (
                <img
                  src={(user.profile_pic_url.startsWith('http') || user.profile_pic_url.startsWith('data:')) ? user.profile_pic_url : `${import.meta.env.VITE_API_URL}${user.profile_pic_url}`}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <span style={{ fontSize: '2rem', fontWeight: '800' }}>{user?.username?.[0].toUpperCase()}</span>
              )}
            </div>
            <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', width: '20px', height: '20px', background: '#10b981', border: '3px solid var(--bg-secondary)', borderRadius: '50%' }}></div>
          </div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.2rem' }}>{user?.first_name || user?.username}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Premium Student</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <SidebarLink to="/student" active={location.pathname === '/student'} label="Dashboard" icon="🏠" onClick={() => setMobileMenu(false)} />
          <SidebarLink to="/student/profile" active={location.pathname === '/student/profile'} label="Settings" icon="⚙️" onClick={() => setMobileMenu(false)} />
        </nav>

        <button
          onClick={handleLogout}
          style={{
            marginTop: 'auto',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            padding: '1rem',
            borderRadius: '16px',
            background: 'rgba(239, 68, 68, 0.05)',
            color: '#ef4444',
            fontWeight: '700',
            cursor: 'pointer',
            transition: '0.3s'
          }}
          onMouseOver={(e) => { e.target.style.background = '#ef4444'; e.target.style.color = '#fff'; }}
          onMouseOut={(e) => { e.target.style.background = 'rgba(239, 68, 68, 0.05)'; e.target.style.color = '#ef4444'; }}
        >
          Logout Session
        </button>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 100, padding: '1.2rem 2rem', background: 'rgba(5, 5, 5, 0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {location.pathname === '/student' ? 'Overview' : 'Profile Settings'}
          </h2>

          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>🔔</div>
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              style={{ display: isMobile ? 'block' : 'none', border: 'none', padding: '0.6rem', borderRadius: '10px', background: 'var(--bg-surface)', color: '#fff', cursor: 'pointer' }}
            >
              ☰
            </button>
          </div>
        </header>

        <main style={{ padding: isMobile ? '1.5rem' : '2rem 3rem' }}>
          <Routes>
            <Route path="/" element={<StudentLibrary user={user} courses={courses} analytics={analytics} loading={loading} />} />
            <Route path="/courses/:courseId" element={<CourseViewer />} />
            <Route path="/profile" element={<ProfileSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
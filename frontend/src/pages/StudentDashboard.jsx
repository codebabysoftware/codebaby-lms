import { useContext, useState, useEffect } from 'react';
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


function StudentLibrary() {
  const { user } = useContext(AuthContext);

  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem(
            'access_token'
          )}`
        };

        const [statsRes, coursesRes] =
          await Promise.all([
            fetch(
              `${import.meta.env.VITE_API_URL}/api/student/analytics/`,
              { headers }
            ),
            fetch(
              `${import.meta.env.VITE_API_URL}/api/student-courses/`,
              { headers }
            )
          ]);

        if (statsRes.ok && coursesRes.ok) {
          setAnalytics(await statsRes.json());
          setCourses(await coursesRes.json());
        }
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: '2rem',
          color: '#cbd5e1'
        }}
      >
        Loading your dashboard...
      </div>
    );
  }

  const glass = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '22px',
    boxShadow: '0 20px 45px rgba(0,0,0,0.18)'
  };

  return (
    <div>
      {/* Hero */}
      <div
        style={{
          position: 'relative',
          height: '50vh',
          minHeight: '400px',
          width: '100%',
          marginBottom: '2rem',
          borderRadius: '12px',
          overflow: 'hidden',
          background: 'linear-gradient(to right, #000 30%, transparent 80%), url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop") center/cover'
        }}
      >
        <div style={{ position: 'absolute', bottom: '15%', left: '4%', maxWidth: '600px', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            {user?.profile_pic_url && (
              <img 
                src={(user.profile_pic_url.startsWith('http') || user.profile_pic_url.startsWith('data:')) ? user.profile_pic_url : `${import.meta.env.VITE_API_URL}${user.profile_pic_url}`} 
                alt="Profile" 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #fff'
                }}
              />
            )}
            <h1 className="hero-title" style={{ fontSize: '3.5rem', fontWeight: '900', color: '#fff', textTransform: 'uppercase', letterSpacing: '-2px', lineHeight: '1' }}>
              Welcome Back
            </h1>
          </div>
          
          <h2 className="hero-subtitle" style={{ fontSize: '1.5rem', fontWeight: '600', color: '#e5e5e5', marginBottom: '1.5rem' }}>
            Continue your journey with {user?.first_name || user?.username}
          </h2>

          <p style={{ color: '#a3a3a3', fontSize: '1.1rem', lineHeight: '1.5', marginBottom: '2rem' }}>
            The most advanced software development curriculum is waiting for you. Access premium lessons and grow your career with CodeBaby Software.
          </p>

          <div className="hero-buttons" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button style={{ padding: '0.8rem 2rem', background: '#fff', color: '#000', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ▶ Play Last Lesson
            </button>
            <button style={{ padding: '0.8rem 2rem', background: 'rgba(109, 109, 110, 0.7)', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
              ⓘ More Info
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      {analytics && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit,minmax(220px,1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}
        >
          <StatCard
            title="Courses"
            value={
              analytics.total_enrollments
            }
            color="#3b82f6"
          />

          <StatCard
            title="Lessons Unlocked"
            value={
              analytics.total_lesson_unlocks
            }
            color="#10b981"
          />
        </div>
      )}

      {/* Courses */}
      <div
        style={{
          marginBottom: '1rem'
        }}
      >
        <h2
          style={{
            color: '#fff',
            fontSize: '1.4rem',
            fontWeight: '700',
            marginBottom: '1rem',
            paddingLeft: '0.5rem'
          }}
        >
          My Courses
        </h2>

        {courses.length === 0 ? (
          <div style={{ color: '#666', padding: '1rem' }}>
            No courses assigned yet.
          </div>
        ) : (
            <div
              className="netflix-slider"
              style={{
                display: 'flex',
                gap: '0.8rem',
                overflowX: 'auto',
                padding: '0.5rem',
                paddingBottom: '2rem',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {courses.map((c) => (
                <Link
                  key={c.id}
                  className="netflix-card"
                  to={`/student/courses/${c.id}`}
                >
                {!c.is_unlocked_overall && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                    <span style={{ color: '#fff', fontSize: '1.2rem' }}>🔒 Locked</span>
                  </div>
                )}
                
                <div style={{ height: '70%', background: 'linear-gradient(45deg, #222, #333)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <span style={{ color: '#444', fontSize: '3rem', fontWeight: 'bold' }}>CODE</span>
                </div>

                <div style={{ padding: '0.8rem', background: '#181818', height: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h3 style={{ color: '#fff', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginTop: '0.2rem' }}>
                     <span style={{ color: '#46d369', fontSize: '0.75rem', fontWeight: 'bold' }}>98% Match</span>
                     <span style={{ color: '#fff', fontSize: '0.75rem', border: '1px solid #666', padding: '0 0.3rem', borderRadius: '2px' }}>HD</span>
                     <span style={{ color: '#aaa', fontSize: '0.75rem' }}>{c.modules?.length || 0} Modules</span>
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
  const { user, logout } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const glass = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.08)'
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: '#141414',
        color: '#fff',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      }}
    >
      <style>
        {`
          @keyframes netflixZoom {
            0% { transform: scale(1); }
            100% { transform: scale(1.08); z-index: 10; }
          }
          
          .netflix-slider::-webkit-scrollbar {
            display: none;
          }
          
          .netflix-card:hover {
            animation: netflixZoom 0.3s forwards;
          }

          .netflix-card {
            min-width: 300px;
            height: 170px;
            background: linear-gradient(to bottom, #222, #111);
            border-radius: 4px;
            position: relative;
            overflow: hidden;
            cursor: pointer;
            text-decoration: none;
            flex-shrink: 0;
          }

          @media (max-width: 600px) {
            .netflix-card {
              min-width: 240px !important;
              height: 140px !important;
            }
          }

          @media (max-width: 900px) {
            .hero-title { font-size: 2.2rem !important; }
            .hero-subtitle { font-size: 1.1rem !important; }
            .hero-buttons { flex-direction: column !important; }
            .sidebar-nav { 
              width: 100% !important; 
              height: 100vh !important; 
              position: fixed !important;
              z-index: 1000 !important;
              background: #000 !important;
            }
          }
        `}
      </style>
      {/* Sidebar */}
      <aside
        className="sidebar-nav"
        style={{
          width: '240px',
          padding: '1.5rem',
          background: '#000',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display:
            window.innerWidth < 900
              ? mobileMenu
                ? 'flex'
                : 'none'
              : 'flex',
          flexDirection: 'column',
          position:
            window.innerWidth < 900
              ? 'fixed'
              : 'relative',
          left: 0,
          top: 0,
          zIndex: 1000,
          height: '100vh'
        }}
      >
        {/* Profile */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2rem'
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              margin: '0 auto 1rem auto',
              background: user?.profile_pic_url 
                ? 'transparent' 
                : 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '1.6rem',
              fontWeight: '800',
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.1)'
            }}
          >
            {user?.profile_pic_url ? (
              <img 
                src={(user.profile_pic_url.startsWith('http') || user.profile_pic_url.startsWith('data:')) ? user.profile_pic_url : `${import.meta.env.VITE_API_URL}${user.profile_pic_url}`} 
                alt="Profile" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              user?.first_name
                ? user.first_name[0].toUpperCase()
                : user?.username?.[0]?.toUpperCase()
            )}
          </div>

          <h3
            style={{
              color: '#fff',
              marginBottom: '.3rem'
            }}
          >
            {user?.first_name ||
              user?.username}
          </h3>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '.85rem'
            }}
          >
            Student Account
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
          <Link
            to="/student"
            onClick={() => setMobileMenu(false)}
            style={{
              padding: '.7rem 0',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem',
              color: location.pathname === '/student' ? '#fff' : '#b3b3b3',
              borderLeft: location.pathname === '/student' ? '4px solid #e50914' : '4px solid transparent',
              paddingLeft: '1rem',
              transition: '0.2s'
            }}
          >
            Home
          </Link>

          <Link
            to="/student/profile"
            onClick={() => setMobileMenu(false)}
            style={{
              padding: '.7rem 0',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.95rem',
              color: location.pathname === '/student/profile' ? '#fff' : '#b3b3b3',
              borderLeft: location.pathname === '/student/profile' ? '4px solid #e50914' : '4px solid transparent',
              paddingLeft: '1rem',
              transition: '0.2s'
            }}
          >
            Profile Settings
          </Link>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: 'auto',
            border: 'none',
            padding: '1rem',
            borderRadius: '14px',
            background:
              'linear-gradient(135deg,#ef4444,#dc2626)',
            color: '#fff',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Secure Logout
        </button>
      </aside>

      {/* Main */}
      <div
        style={{
          flex: 1,
          minWidth: 0
        }}
      >
        {/* Topbar */}
        <div
          style={{
            padding: '1.1rem 1.5rem',
            borderBottom:
              '1px solid rgba(255,255,255,.06)',
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h2
              style={{
                color: '#fff',
                fontSize: '1.25rem',
                fontWeight: '800'
              }}
            >
              CodeBaby Learning Portal
            </h2>
          </div>

          <button
            onClick={() =>
              setMobileMenu(
                !mobileMenu
              )
            }
            style={{
              display:
                window.innerWidth <
                  900
                  ? 'block'
                  : 'none',
              border: 'none',
              padding:
                '.7rem 1rem',
              borderRadius:
                '12px',
              background:
                'rgba(255,255,255,.08)',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
        </div>

        <main
          style={{
            padding: '1.5rem'
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <StudentLibrary />
              }
            />

            <Route
              path="/courses/:courseId"
              element={
                <CourseViewer />
              }
            />

            <Route
              path="/profile"
              element={
                <ProfileSettings />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color
}) {
  return (
    <div
      style={{
        background:
          'rgba(255,255,255,0.08)',
        backdropFilter:
          'blur(18px)',
        border:
          '1px solid rgba(255,255,255,0.08)',
        borderRadius:
          '22px',
        padding: '1.25rem'
      }}
    >
      <div
        style={{
          width: '42px',
          height: '4px',
          borderRadius:
            '999px',
          background: color,
          marginBottom:
            '1rem'
        }}
      />

      <h2
        style={{
          color: '#fff',
          fontSize: '2rem',
          marginBottom:
            '.3rem'
        }}
      >
        {value}
      </h2>

      <p
        style={{
          color: '#94a3b8',
          fontSize: '.85rem',
          textTransform:
            'uppercase',
          letterSpacing:
            '1px',
          fontWeight:
            '700'
        }}
      >
        {title}
      </p>
    </div>
  );
}
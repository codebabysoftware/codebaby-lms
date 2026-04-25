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
          ...glass,
          padding: '2rem',
          marginBottom: '1.5rem',
          background:
            'linear-gradient(135deg, rgba(59,130,246,.20), rgba(139,92,246,.15))'
        }}
      >
        <h1
          style={{
            color: '#fff',
            fontSize: '2rem',
            fontWeight: '800',
            marginBottom: '.45rem'
          }}
        >
          Welcome back,{' '}
          <span style={{ color: '#60a5fa' }}>
            {user?.first_name ||
              user?.username}
          </span>
        </h1>

        <p
          style={{
            color: '#cbd5e1',
            maxWidth: '700px',
            lineHeight: '1.7'
          }}
        >
          Continue learning, access
          premium lessons and grow
          your career with CodeBaby
          Software.
        </p>
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
            fontSize: '1.35rem',
            fontWeight: '700',
            marginBottom: '1rem'
          }}
        >
          My Courses
        </h2>

        {courses.length === 0 ? (
          <div
            style={{
              color: '#94a3b8'
            }}
          >
            No courses assigned yet.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit,minmax(300px,1fr))',
              gap: '1rem'
            }}
          >
            {courses.map((c) => (
              <div
                key={c.id}
                style={{
                  ...glass,
                  overflow: 'hidden'
                }}
              >
                {/* Cover */}
                <div
                  style={{
                    height: '120px',
                    background:
                      'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                    position:
                      'relative'
                  }}
                >
                  {!c.is_unlocked_overall && (
                    <div
                      style={{
                        position:
                          'absolute',
                        inset: 0,
                        background:
                          'rgba(15,23,42,.75)',
                        display:
                          'flex',
                        alignItems:
                          'center',
                        justifyContent:
                          'center',
                        color: '#fff',
                        fontWeight:
                          '700'
                      }}
                    >
                      🔒 Locked
                    </div>
                  )}
                </div>

                <div
                  style={{
                    padding: '1.25rem'
                  }}
                >
                  <div
                    style={{
                      display:
                        'flex',
                      justifyContent:
                        'space-between',
                      gap: '.8rem',
                      marginBottom:
                        '.7rem'
                    }}
                  >
                    <h3
                      style={{
                        color:
                          '#fff',
                        fontSize:
                          '1.1rem'
                      }}
                    >
                      {c.title}
                    </h3>

                    <span
                      style={{
                        fontSize:
                          '.75rem',
                        padding:
                          '.35rem .55rem',
                        borderRadius:
                          '999px',
                        background:
                          'rgba(255,255,255,.08)',
                        color:
                          '#cbd5e1'
                      }}
                    >
                      {c.modules
                        ?.length ||
                        0}{' '}
                      Modules
                    </span>
                  </div>

                  <p
                    style={{
                      color:
                        '#94a3b8',
                      fontSize:
                        '.9rem',
                      lineHeight:
                        '1.6',
                      minHeight:
                        '50px'
                    }}
                  >
                    {c.description}
                  </p>

                  <Link
                    to={`/student/courses/${c.id}`}
                    style={{
                      marginTop:
                        '1rem',
                      display:
                        'flex',
                      justifyContent:
                        'center',
                      alignItems:
                        'center',
                      padding:
                        '.9rem 1rem',
                      borderRadius:
                        '14px',
                      textDecoration:
                        'none',
                      color: '#fff',
                      fontWeight:
                        '700',
                      background:
                        c.is_unlocked_overall
                          ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                          : 'rgba(255,255,255,.06)',
                      pointerEvents:
                        c.is_unlocked_overall
                          ? 'auto'
                          : 'none',
                      opacity:
                        c.is_unlocked_overall
                          ? 1
                          : .6
                    }}
                  >
                    {c.is_unlocked_overall
                      ? 'Enter Course'
                      : 'Waiting for Unlock'}
                  </Link>
                </div>
              </div>
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
        background:
          'linear-gradient(135deg,#0f172a 0%,#111827 45%,#1e293b 100%)'
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: '270px',
          maxWidth: '100%',
          padding: '1.5rem',
          borderRight:
            '1px solid rgba(255,255,255,.06)',
          ...glass,
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
              margin:
                '0 auto 1rem auto',
              background:
                'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              display: 'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              color: '#fff',
              fontSize: '1.6rem',
              fontWeight: '800'
            }}
          >
            {user?.first_name
              ? user.first_name[0].toUpperCase()
              : user?.username?.[0]?.toUpperCase()}
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
            onClick={() =>
              setMobileMenu(false)
            }
            style={{
              padding:
                '.95rem 1rem',
              borderRadius:
                '14px',
              textDecoration:
                'none',
              fontWeight:
                '700',
              color:
                location.pathname ===
                  '/student'
                  ? '#fff'
                  : '#cbd5e1',
              background:
                location.pathname ===
                  '/student'
                  ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                  : 'rgba(255,255,255,.04)'
            }}
          >
            📚 My Library
          </Link>

          <div
            style={{
              padding:
                '.95rem 1rem',
              borderRadius:
                '14px',
              color: '#64748b',
              background:
                'rgba(255,255,255,.03)'
            }}
          >
            ⚙️ Preferences
          </div>
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
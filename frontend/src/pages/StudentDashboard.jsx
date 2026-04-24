import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import CourseViewer from './student/CourseViewer';

function StudentLibrary() {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersonalData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` };
        
        // Parallel Personal Metadata Fetch
        const [statsRes, coursesRes] = await Promise.all([
          fetch(`http://localhost:8000/api/student/analytics/', { headers }),
          fetch(`http://localhost:8000/api/student-courses/', { headers })
        ]);

        if (statsRes.ok && coursesRes.ok) {
          setAnalytics(await statsRes.json());
          setCourses(await coursesRes.json());
        }
      } catch(e) {} finally {
        setLoading(false);
      }
    };
    fetchPersonalData();
  }, []);

  if (loading) return <div style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Loading your dashboard...</div>;

  return (
    <div>
      {/* 1. Personalized Hero Banner */}
      <div className="glass-panel" style={{ padding: '3rem 2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(30,58,138,0.3) 0%, rgba(15,23,42,0.6) 100%)', border: '1px solid rgba(59,130,246,0.3)' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          Welcome back, <span style={{ color: 'var(--accent-color)' }}>{user?.first_name || user?.username}</span>!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>
          Resume your learning journey. Access your premium course material and encrypted resources precisely when you need them.
        </p>
      </div>

      {/* 2. Personal Analytics Ribbon */}
      {analytics && (
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem' }}>
          <div className="glass-panel" style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>📚</span>
            <div>
              <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--accent-hover)' }}>{analytics.total_enrollments}</h2>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Courses Enrolled</span>
            </div>
          </div>
          <div className="glass-panel" style={{ flex: '1', display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🔓</span>
            <div>
              <h2 style={{ fontSize: '2rem', margin: 0, color: '#4caf50' }}>{analytics.total_lesson_unlocks}</h2>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Lessons Unlocked</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Aesthetic Course Library */}
      <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Your Curriculum Map</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {courses.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>You are not officially enrolled in any courses yet.</p> : courses.map(c => (
          
          <div key={c.id} className="glass-panel" style={{ 
            position: 'relative', 
            overflow: 'hidden', 
            padding: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            transform: 'translateY(0)', 
            transition: 'transform 0.2s',
            cursor: 'default'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Dynamic Cover Graphic */}
            <div style={{ height: '120px', background: 'linear-gradient(45deg, #1e3a8a, #3b82f6)', position: 'relative' }}>
              {!c.is_unlocked_overall && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <span style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔒</span>
                  <span style={{ fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.875rem' }}>Access Restricted</span>
                </div>
              )}
            </div>

            <div style={{ padding: '1.5rem', flex: '1', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.25rem', margin: 0 }}>{c.title}</h4>
                <span style={{ background: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                  {c.modules?.length || 0} Modules
                </span>
              </div>
              
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem', flex: '1', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {c.description}
              </p>
              
              <div style={{ marginTop: '1.5rem' }}>
                <Link to={`/student/courses/${c.id}`} className="btn-primary" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  textDecoration: 'none', 
                  background: c.is_unlocked_overall ? 'var(--accent-color)' : 'var(--bg-secondary)',
                  opacity: c.is_unlocked_overall ? 1 : 0.6,
                  pointerEvents: c.is_unlocked_overall ? 'auto' : 'none'
                }}>
                  {c.is_unlocked_overall ? 'Enter Course Workspace' : 'Waiting for Admin Unlock'}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <div className="sidebar glass-panel">
        <div style={{ textAlign: 'center', paddingBottom: '2rem', marginBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ width: '60px', height: '60px', background: 'var(--accent-color)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {user?.first_name ? user.first_name[0].toUpperCase() : user?.username[0].toUpperCase()}
          </div>
          <h3 style={{ margin: 0 }}>{user?.first_name || user?.username}</h3>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Student Account</span>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/student" style={{ padding: '0.75rem 1rem', background: 'rgba(59,130,246,0.1)', color: 'var(--accent-color)', borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none' }}>
            📚 My Library
          </Link>
          <Link to="#" style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)', textDecoration: 'none', opacity: 0.5, cursor: 'not-allowed' }}>
            ⚙️ Preferences
          </Link>
        </nav>
        
        <button onClick={handleLogout} className="btn-primary" style={{ marginTop: 'auto', position: 'absolute', bottom: '2rem', width: 'calc(100% - 2rem)', background: 'var(--danger-color)' }}>
          Secure Logout
        </button>
      </div>
      
      <div className="main-content" style={{ padding: '2rem 3rem' }}>
        <Routes>
          <Route path="/" element={<StudentLibrary />} />
          <Route path="/courses/:courseId" element={<CourseViewer />} />
        </Routes>
      </div>
    </div>
  );
}

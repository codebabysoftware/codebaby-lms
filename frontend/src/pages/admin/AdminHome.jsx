import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function AdminHome() {
  const [analytics, setAnalytics] = useState({
    students: null,
    courses: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGlobalPayload = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` };
        
        // Execute parallel requests to capture all angles of the platform
        const [studentRes, courseRes] = await Promise.all([
          fetch(`http://localhost:8000/api/admin/analytics/', { headers }),
          fetch(`http://localhost:8000/api/courses/analytics/', { headers })
        ]);

        if (studentRes.ok && courseRes.ok) {
          const students = await studentRes.json();
          const courses = await courseRes.json();
          setAnalytics({ students, courses });
        } else {
          setError(true);
        }
      } catch (e) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchGlobalPayload();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading Global Matrix...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'var(--danger-color)' }}>Failed to aggregate global analytics. Check server connection.</div>;

  return (
    <div style={{ marginTop: '2rem' }}>
      {/* High-Level Overview Ribbon */}
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Global Platform Health</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem 1rem', borderTop: '4px solid var(--accent-color)' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>{analytics.students.active_students}<span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}> / {analytics.students.total_students}</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Active Users (7 Days)</p>
        </div>

        <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem 1rem', borderTop: '4px solid var(--accent-hover)' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>{analytics.courses.total_courses}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Platform Courses</p>
        </div>

        <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem 1rem', borderTop: '4px solid #ffb347' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>{analytics.courses.total_enrollments}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Course Enrollments</p>
        </div>

        <div className="glass-panel" style={{ textAlign: 'center', padding: '2rem 1rem', borderTop: '4px solid #4caf50' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '0.25rem' }}>{analytics.students.total_lesson_unlocks}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Lessons Granted</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Quick Actions Hub */}
        <div style={{ flex: '1', minWidth: '350px' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Quick Deployment Actions</h3>
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            
            <Link to="/admin/students" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', height: '60px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)' }}>
              🎓 Issue New Student ID
            </Link>

            <Link to="/admin/courses/create" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', height: '60px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)' }}>
              📚 Open Course Compiler
            </Link>

            <Link to="/admin/access" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', height: '60px', fontSize: '1.1rem', background: 'rgba(255,255,255,0.05)' }}>
              🔑 Execute Bulk Assignments
            </Link>
            
          </div>
        </div>

        {/* System Intelligence Box */}
        <div style={{ flex: '1', minWidth: '350px' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>System Metrics Breakdown</h3>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Distributed Modules</strong>
              <span style={{ color: 'var(--accent-color)' }}>{analytics.courses.total_modules} Mapped</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Total Encrypted Video / PDF Nodes</strong>
              <span style={{ color: 'var(--accent-color)' }}>{analytics.courses.total_lessons} Secured</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <strong style={{ color: 'var(--text-primary)' }}>System Security Friction</strong>
              <span style={{ color: '#4caf50' }}>[Active]</span>
            </div>
             <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '2rem', lineHeight: '1.5' }}>
               All database mapping endpoints are operating optimally. Browser-level capture deterrence (ContextMenu, KeyCapture) is strictly enforced across all student endpoints.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

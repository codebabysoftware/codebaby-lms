import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_courses: 0,
    total_modules: 0,
    total_lessons: 0,
    total_enrollments: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` };
      
      const statsRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/courses/analytics/', { headers });
      if (statsRes.ok) setAnalytics(await statsRes.json());

      const coursesRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/courses/', { headers });
      if (coursesRes.ok) setCourses(await coursesRes.json());
      
    } catch (e) {
      setMessage("Failed to load course data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`DANGER: Are you absolutely sure you want to delete "${title}"? This will obliterate the course, all its nested modules, lessons, video files, and permanently destroy all student access records tied to it.`)) {
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/courses/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });

      if (res.ok) {
        fetchData();
      } else {
        setMessage("Failed to execute deletion.");
      }
    } catch(e) {
      setMessage("Network error during deletion.");
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading Course Data...</div>;

  return (
    <div style={{ marginTop: '2rem' }}>
      
      {/* 1. Analytics Dashboard Top Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-color)', marginBottom: '0.25rem' }}>{analytics.total_courses}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Classes Created</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-hover)', marginBottom: '0.25rem' }}>{analytics.total_modules}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Modules Mapped</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#ffb347', marginBottom: '0.25rem' }}>{analytics.total_lessons}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Lessons Uploaded</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#4caf50', marginBottom: '0.25rem' }}>{analytics.total_enrollments}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Global Enrollments</p>
        </div>
      </div>

      {message && <div className="error-text" style={{ marginBottom: '1rem', color: 'var(--danger-color)' }}>{message}</div>}

      {/* 2. Detailed Course Table */}
      <div className="glass-panel" style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Curriculum Core</h3>
          <Link to="/admin/courses/create" className="btn-primary" style={{ width: 'auto', textDecoration: 'none', margin: 0 }}>
            + Form New Course
          </Link>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '0.75rem', fontWeight: 500 }}>Course Title</th>
              <th style={{ padding: '0.75rem', fontWeight: 500 }}>Complexity</th>
              <th style={{ padding: '0.75rem', fontWeight: 500 }}>Enrollments</th>
              <th style={{ padding: '0.75rem', fontWeight: 500 }}>Date Created</th>
              <th style={{ padding: '0.75rem', fontWeight: 500, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No courses structurally defined yet.</td></tr>
            ) : courses.map(course => {
              const moduleCount = course.modules?.length || 0;
              const lessonCount = course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 0;

              return (
                <tr key={course.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', animation: 'slideUpFadeIn 0.3s ease-out forwards' }}>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: 'bold' }}>
                    {course.title}
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: 'normal' }}>
                       {course.description?.substring(0, 50)}{course.description?.length > 50 ? '...' : ''}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 0.75rem' }}>
                    <span style={{ background: 'var(--bg-secondary)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem', marginRight: '0.5rem' }}>
                      {moduleCount} Modules
                    </span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                       {lessonCount} Lessons
                    </span>
                  </td>
                  <td style={{ padding: '1rem 0.75rem', color: 'var(--accent-hover)', fontWeight: 'bold' }}>
                    {course.enrollment_count} Students
                  </td>
                  <td style={{ padding: '1rem 0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {new Date(course.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link to={`/admin/courses/${course.id}/edit`} className="btn-primary" style={{ textDecoration: 'none', padding: '0.25rem 0.75rem', margin: 0, width: 'auto', fontSize: '0.875rem' }}>
                        Builder
                      </Link>
                      <button onClick={() => handleDelete(course.id, course.title)} className="btn-primary" style={{ padding: '0.25rem 0.75rem', margin: 0, width: 'auto', fontSize: '0.875rem', background: 'var(--danger-color)' }}>
                        Destruct
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

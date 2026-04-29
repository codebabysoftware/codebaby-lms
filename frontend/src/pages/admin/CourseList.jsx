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

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const statsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses/analytics/`,
        { headers: authHeader }
      );

      if (statsRes.ok) {
        setAnalytics(await statsRes.json());
      }

      const coursesRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses/`,
        { headers: authHeader }
      );

      if (coursesRes.ok) {
        setCourses(await coursesRes.json());
      }
    } catch {
      setMessage('Failed to load course data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(
        `Delete "${title}"? This will permanently remove course, modules, lessons and enrollments.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses/${id}/`,
        {
          method: 'DELETE',
          headers: authHeader
        }
      );

      if (res.ok) {
        fetchData();
      } else {
        setMessage('Failed to delete course.');
      }
    } catch {
      setMessage('Network error during deletion.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', color: '#fff' }}>
        Loading courses...
      </div>
    );
  }

  const statCard = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '22px',
    padding: '1.4rem',
    boxShadow: '0 20px 45px rgba(0,0,0,0.18)'
  };

  const mainCard = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '1.5rem',
    boxShadow: '0 20px 45px rgba(0,0,0,0.18)'
  };

  const button = {
    border: 'none',
    padding: '.75rem 1rem',
    borderRadius: '12px',
    cursor: 'pointer',
    fontWeight: '700',
    color: '#fff',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header */}
      <div
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <h1
            style={{
              color: '#fff',
              fontSize: '2rem',
              fontWeight: '800',
              marginBottom: '.35rem'
            }}
          >
            Course Management
          </h1>

          <p style={{ color: '#94a3b8' }}>
            Build, manage and scale your premium courses.
          </p>
        </div>

        <Link
          to="/admin/courses/create"
          style={{
            ...button,
            background:
              'linear-gradient(135deg,#3b82f6,#8b5cf6)'
          }}
        >
          + Create Course
        </Link>
      </div>

      {/* Analytics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(220px,1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <StatBox
          label="Courses"
          value={analytics.total_courses}
          color="#3b82f6"
          style={statCard}
        />

        <StatBox
          label="Modules"
          value={analytics.total_modules}
          color="#8b5cf6"
          style={statCard}
        />

        <StatBox
          label="Lessons"
          value={analytics.total_lessons}
          color="#f59e0b"
          style={statCard}
        />

        <StatBox
          label="Enrollments"
          value={analytics.total_enrollments}
          color="#10b981"
          style={statCard}
        />
      </div>

      {/* Error */}
      {message && (
        <div
          style={{
            marginBottom: '1rem',
            color: '#f87171',
            fontWeight: '600'
          }}
        >
          {message}
        </div>
      )}

      {/* Courses */}
      <div style={mainCard}>
        <h3
          style={{
            color: '#fff',
            marginBottom: '1.25rem',
            fontSize: '1.2rem'
          }}
        >
          All Courses
        </h3>

        {courses.length === 0 ? (
          <div
            style={{
              padding: '2rem',
              textAlign: 'center',
              color: '#94a3b8'
            }}
          >
            No courses available.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit,minmax(320px,1fr))',
              gap: '1rem'
            }}
          >
            {courses.map((course) => {
              const moduleCount =
                course.modules?.length || 0;

              const lessonCount =
                course.modules?.reduce(
                  (acc, m) =>
                    acc +
                    (m.lessons?.length || 0),
                  0
                ) || 0;

              return (
                <div
                  key={course.id}
                  style={{
                    background:
                      'rgba(255,255,255,0.04)',
                    border:
                      '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '20px',
                    padding: '1.25rem',
                    overflow: 'hidden'
                  }}
                >
                  {/* Thumbnail */}
                  <div style={{ 
                    width: 'calc(100% + 2.5rem)', 
                    height: '140px', 
                    margin: '-1.25rem -1.25rem 1.25rem -1.25rem',
                    background: 'rgba(0,0,0,0.2)',
                    overflow: 'hidden'
                  }}>
                    {(course.thumbnail_base64 || course.thumbnail) ? (
                      <img 
                        src={course.thumbnail_base64 || `${import.meta.env.VITE_API_URL}${course.thumbnail}`} 
                        alt={course.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: '2rem' }}>
                        📚
                      </div>
                    )}
                  </div>

                  <h4
                    style={{
                      color: '#fff',
                      fontSize: '1.1rem',
                      marginBottom: '.45rem'
                    }}
                  >
                    {course.title}
                  </h4>

                  <p
                    style={{
                      color: '#94a3b8',
                      fontSize: '.9rem',
                      lineHeight: '1.6',
                      minHeight: '48px',
                      marginBottom: '1rem'
                    }}
                  >
                    {course.description ||
                      'No description added.'}
                  </p>

                  {/* Tags */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '.5rem',
                      marginBottom: '1rem'
                    }}
                  >
                    <Tag>
                      {moduleCount} Modules
                    </Tag>

                    <Tag>
                      {lessonCount} Lessons
                    </Tag>

                    <Tag green>
                      {course.enrollment_count}{' '}
                      Students
                    </Tag>
                  </div>

                  {/* Footer */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      gap: '.8rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span
                      style={{
                        color: '#64748b',
                        fontSize: '.82rem'
                      }}
                    >
                      {new Date(
                        course.created_at
                      ).toLocaleDateString()}
                    </span>

                    <div
                      style={{
                        display: 'flex',
                        gap: '.6rem',
                        flexWrap: 'wrap'
                      }}
                    >
                      <Link
                        to={`/admin/courses/${course.id}/edit`}
                        style={{
                          ...button,
                          padding:
                            '.65rem .95rem',
                          fontSize: '.9rem',
                          background:
                            'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                        }}
                      >
                        Builder
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            course.id,
                            course.title
                          )
                        }
                        style={{
                          ...button,
                          padding:
                            '.65rem .95rem',
                          fontSize: '.9rem',
                          background:
                            'linear-gradient(135deg,#ef4444,#dc2626)'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
  style
}) {
  return (
    <div style={style}>
      <div
        style={{
          width: '42px',
          height: '4px',
          borderRadius: '10px',
          background: color,
          marginBottom: '1rem'
        }}
      />

      <h2
        style={{
          color: '#fff',
          fontSize: '2rem',
          marginBottom: '.35rem'
        }}
      >
        {value}
      </h2>

      <p
        style={{
          color: '#94a3b8',
          fontSize: '.85rem',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          fontWeight: '700'
        }}
      >
        {label}
      </p>
    </div>
  );
}

function Tag({ children, green }) {
  return (
    <span
      style={{
        padding: '.45rem .7rem',
        borderRadius: '999px',
        fontSize: '.8rem',
        fontWeight: '700',
        color: green ? '#10b981' : '#cbd5e1',
        background: 'rgba(255,255,255,0.06)'
      }}
    >
      {children}
    </span>
  );
}
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
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        };

        const [studentRes, courseRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/admin/analytics/`, {
            headers
          }),
          fetch(`${import.meta.env.VITE_API_URL}/api/courses/analytics/`, {
            headers
          })
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

  if (loading)
    return (
      <div
        style={{
          padding: '3rem',
          color: 'white',
          textAlign: 'center',
          fontSize: '1.1rem'
        }}
      >
        Loading Dashboard...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          padding: '3rem',
          color: '#ff6b6b',
          textAlign: 'center',
          fontSize: '1rem'
        }}
      >
        Failed to load analytics. Check backend connection.
      </div>
    );

  const cards = [
    {
      title: 'Active Users',
      value: analytics.students.active_students,
      sub: `/ ${analytics.students.total_students}`,
      color: '#3b82f6'
    },
    {
      title: 'Courses',
      value: analytics.courses.total_courses,
      sub: '',
      color: '#8b5cf6'
    },
    {
      title: 'Enrollments',
      value: analytics.courses.total_enrollments,
      sub: '',
      color: '#f59e0b'
    },
    {
      title: 'Lessons Granted',
      value: analytics.students.total_lesson_unlocks,
      sub: '',
      color: '#10b981'
    }
  ];

  return (
    <div
      style={{
        padding: '2rem',
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e293b 100%)'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            color: '#fff',
            fontSize: '2rem',
            marginBottom: '.4rem',
            fontWeight: '800'
          }}
        >
          Admin Dashboard
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
          Monitor platform growth, students and content controls.
        </p>
      </div>

      {/* Top Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: '1.2rem',
          marginBottom: '2rem'
        }}
      >
        {cards.map((card, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(255,255,255,0.08)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div
              style={{
                width: '42px',
                height: '4px',
                borderRadius: '10px',
                background: card.color,
                marginBottom: '1rem'
              }}
            />

            <h2
              style={{
                color: '#fff',
                fontSize: '2.3rem',
                marginBottom: '.4rem'
              }}
            >
              {card.value}
              <span
                style={{
                  fontSize: '.95rem',
                  color: '#94a3b8',
                  marginLeft: '4px'
                }}
              >
                {card.sub}
              </span>
            </h2>

            <p
              style={{
                color: '#cbd5e1',
                fontSize: '.85rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: '600'
              }}
            >
              {card.title}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Quick Actions */}
        <div
          style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
            borderRadius: '22px',
            padding: '2rem',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <h3
            style={{
              color: '#fff',
              marginBottom: '1.5rem',
              fontSize: '1.2rem'
            }}
          >
            Quick Actions
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <Link
              to="/admin/students"
              style={buttonStyle}
            >
              🎓 Issue Student ID
            </Link>

            <Link
              to="/admin/courses/create"
              style={buttonStyle}
            >
              📚 Create Course
            </Link>

            <Link
              to="/admin/access"
              style={buttonStyle}
            >
              🔑 Manage Access
            </Link>
          </div>
        </div>

        {/* System Metrics */}
        <div
          style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
            borderRadius: '22px',
            padding: '2rem',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <h3
            style={{
              color: '#fff',
              marginBottom: '1.5rem',
              fontSize: '1.2rem'
            }}
          >
            Platform Metrics
          </h3>

          <MetricRow
            label="Distributed Modules"
            value={`${analytics.courses.total_modules} Modules`}
          />

          <MetricRow
            label="Secured Lessons"
            value={`${analytics.courses.total_lessons} Items`}
          />

          <MetricRow
            label="Protection Status"
            value="Active"
            green
          />

          <p
            style={{
              color: '#94a3b8',
              fontSize: '.9rem',
              marginTop: '1.5rem',
              lineHeight: '1.7'
            }}
          >
            Security layers and access control systems are active across all
            student endpoints.
          </p>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value, green }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '1rem 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <span style={{ color: '#e2e8f0' }}>{label}</span>

      <strong style={{ color: green ? '#10b981' : '#60a5fa' }}>
        {value}
      </strong>
    </div>
  );
}

const buttonStyle = {
  textDecoration: 'none',
  color: '#fff',
  background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
  padding: '1rem',
  borderRadius: '14px',
  textAlign: 'center',
  fontWeight: '700',
  transition: '0.3s ease'
};
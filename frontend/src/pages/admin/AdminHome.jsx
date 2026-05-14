import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Key, Award, UserPlus, PlusCircle, Shield, ShieldCheck } from 'lucide-react';

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
      <div style={{ padding: "2rem", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <div className="shimmer-bg" style={{ width: "200px", height: "12px", borderRadius: "6px" }}></div>
      </div>
    );

  if (error)
    return (
      <div
        style={{
          padding: '3rem',
          color: '#ef4444',
          textAlign: 'center',
          fontSize: '1.1rem',
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '16px',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          marginTop: '2rem'
        }}
      >
        Failed to load analytics. Check backend connection.
      </div>
    );

  const cards = [
    {
      title: 'Active Users',
      value: analytics.students.active_students_last_7_days || analytics.students.active_students || 0,
      sub: `/ ${analytics.students.total_students}`,
      color: '#3b82f6',
      icon: Users
    },
    {
      title: 'Courses',
      value: analytics.courses.total_courses,
      sub: '',
      color: '#8b5cf6',
      icon: BookOpen
    },
    {
      title: 'Enrollments',
      value: analytics.courses.total_enrollments,
      sub: '',
      color: '#f59e0b',
      icon: Award
    },
    {
      title: 'Lessons Granted',
      value: analytics.students.total_lesson_unlocks,
      sub: '',
      color: '#10b981',
      icon: Key
    }
  ];

  return (
    <div
      style={{
        padding: '0.5rem',
        animation: 'slideUpFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h1
          style={{
            color: '#fff',
            fontSize: '2.2rem',
            marginBottom: '.5rem',
            fontWeight: '800',
            letterSpacing: '-0.5px'
          }}
        >
          Admin Dashboard
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
          Monitor platform growth, students and content controls.
        </p>
      </div>

      {/* Top Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}
      >
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="premium-glass"
              style={{
                borderRadius: '20px',
                padding: '1.5rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 12px 30px ${card.color}22`;
                e.currentTarget.style.borderColor = `${card.color}44`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: `linear-gradient(135deg, ${card.color}33, ${card.color}11)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: card.color,
                  boxShadow: `inset 0 0 0 1px ${card.color}44`,
                  flexShrink: 0
                }}
              >
                {Icon && <Icon size={26} strokeWidth={2.5} />}
              </div>
              
              <div>
                <p
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '4px'
                  }}
                >
                  {card.title}
                </p>
                <h2
                  style={{
                    color: '#fff',
                    fontSize: '2rem',
                    fontWeight: 800,
                    margin: 0,
                    lineHeight: 1
                  }}
                >
                  {card.value}
                  <span
                    style={{
                      fontSize: '1rem',
                      color: '#94a3b8',
                      marginLeft: '6px',
                      fontWeight: 600
                    }}
                  >
                    {card.sub}
                  </span>
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem'
        }}
      >
        {/* Quick Actions */}
        <div
          className="premium-glass"
          style={{
            borderRadius: '24px',
            padding: '2rem',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '10px', color: '#3b82f6' }}>
              <PlusCircle size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
              Quick Actions
            </h3>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <Link
              to="/admin/students"
              className="btn-premium"
              style={{ width: '100%', justifyContent: 'flex-start', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <UserPlus size={18} style={{ color: '#3b82f6' }} />
              Issue Student ID
            </Link>

            <Link
              to="/admin/courses/create"
              className="btn-premium"
              style={{ width: '100%', justifyContent: 'flex-start', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <BookOpen size={18} style={{ color: '#8b5cf6' }} />
              Create Course
            </Link>

            <Link
              to="/admin/access"
              className="btn-premium"
              style={{ width: '100%', justifyContent: 'flex-start', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <Shield size={18} style={{ color: '#10b981' }} />
              Manage Access
            </Link>
          </div>
        </div>

        {/* System Metrics */}
        <div
          className="premium-glass"
          style={{
            borderRadius: '24px',
            padding: '2rem',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '8px', borderRadius: '10px', color: '#10b981' }}>
              <ShieldCheck size={20} />
            </div>
            <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#fff' }}>
              Platform Metrics
            </h3>
          </div>

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

          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
            }}
          >
            <p
              style={{
                color: '#10b981',
                fontSize: '0.9rem',
                lineHeight: '1.6',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <ShieldCheck size={18} />
              Security layers and access control systems are active across all student endpoints.
            </p>
          </div>
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
        alignItems: 'center',
        padding: '1.25rem 1rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        transition: 'background 0.2s ease',
        borderRadius: '8px'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{label}</span>

      {green ? (
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.8rem", borderRadius: "20px", background: "rgba(16, 185, 129, 0.15)", color: "#10b981", fontSize: "0.85rem", fontWeight: 700 }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 8px #10b981" }}></div>
          {value}
        </span>
      ) : (
        <strong style={{ color: '#fff', fontSize: '1.05rem' }}>
          {value}
        </strong>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [analytics, setAnalytics] = useState({
    total_students: 0,
    active_students: 0,
    total_enrollments: 0,
    total_lesson_unlocks: 0
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  };

  const fetchData = async () => {
    try {
      const statsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/analytics/`,
        { headers: authHeader }
      );

      if (statsRes.ok) {
        setAnalytics(await statsRes.json());
      }

      const studentsRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/students/`,
        { headers: authHeader }
      );

      if (studentsRes.ok) {
        setStudents(await studentsRes.json());
      }
    } catch { }
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/students/create/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader
          },
          body: JSON.stringify({
            username,
            password,
            first_name: firstName,
            last_name: lastName
          })
        }
      );

      if (res.ok) {
        setMessage('Student successfully created!');
        setUsername('');
        setPassword('');
        setFirstName('');
        setLastName('');
        fetchData();
      } else {
        const errData = await res.json();
        setMessage(
          'Creation Failed: ' +
          JSON.stringify(errData)
        );
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(
        `Delete student "${name}"? This will permanently remove all data and access records.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/students/${id}/delete/`,
        {
          method: 'DELETE',
          headers: authHeader
        }
      );

      if (res.ok) {
        setMessage(`Student "${name}" deleted.`);
        fetchData();
      } else {
        setMessage('Failed to delete student.');
      }
    } catch {
      setMessage('Network error during deletion.');
    }
  };

  const glassCard = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '22px',
    padding: '1.5rem',
    boxShadow: '0 20px 45px rgba(0,0,0,0.18)'
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    outline: 'none',
    fontSize: '.95rem'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '.45rem',
    color: '#e2e8f0',
    fontSize: '.9rem',
    fontWeight: '600'
  };

  const btnPrimary = {
    border: 'none',
    padding: '1rem 1.2rem',
    borderRadius: '14px',
    background:
      'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer'
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            color: '#fff',
            fontSize: '2rem',
            fontWeight: '800',
            marginBottom: '.35rem'
          }}
        >
          Student Management
        </h1>

        <p style={{ color: '#94a3b8' }}>
          Manage students, registrations and access.
        </p>
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
        <StatCard
          title="Students"
          value={analytics.total_students}
          color="#3b82f6"
          style={glassCard}
        />

        <StatCard
          title="Active Users"
          value={analytics.active_students}
          color="#8b5cf6"
          style={glassCard}
        />

        <StatCard
          title="Enrollments"
          value={analytics.total_enrollments}
          color="#f59e0b"
          style={glassCard}
        />

        <StatCard
          title="Lessons Unlocked"
          value={analytics.total_lesson_unlocks}
          color="#10b981"
          style={glassCard}
        />
      </div>

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(360px,1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Create Student */}
        <div style={glassCard}>
          <h3
            style={{
              color: '#fff',
              marginBottom: '1.2rem'
            }}
          >
            Create Student ID
          </h3>

          <form onSubmit={handleCreateStudent}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>
                Username / ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>
                Temporary Password
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                style={inputStyle}
              />
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit,minmax(140px,1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}
            >
              <div>
                <label style={labelStyle}>
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) =>
                    setFirstName(e.target.value)
                  }
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) =>
                    setLastName(e.target.value)
                  }
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={btnPrimary}
            >
              {loading
                ? 'Processing...'
                : 'Register Student'}
            </button>

            {message && (
              <div
                style={{
                  marginTop: '1rem',
                  color:
                    message
                      .toLowerCase()
                      .includes(
                        'successfully'
                      ) ||
                      message
                        .toLowerCase()
                        .includes('deleted')
                      ? '#10b981'
                      : '#f87171',
                  fontWeight: '600'
                }}
              >
                {message}
              </div>
            )}
          </form>
        </div>

        {/* Student List */}
        <div style={glassCard}>
          <h3
            style={{
              color: '#fff',
              marginBottom: '1.2rem'
            }}
          >
            Student Roster
          </h3>

          {students.length === 0 ? (
            <div
              style={{
                color: '#94a3b8',
                padding: '1rem 0'
              }}
            >
              No students registered.
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '.9rem',
                maxHeight: '700px',
                overflowY: 'auto',
                paddingRight: '.25rem'
              }}
            >
              {students.map((student) => (
                <div
                  key={student.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '16px',
                    background:
                      'rgba(255,255,255,0.04)',
                    border:
                      '1px solid rgba(255,255,255,0.06)',
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h4
                      style={{
                        color: '#fff',
                        marginBottom: '.25rem'
                      }}
                    >
                      {student.username}
                    </h4>

                    <p
                      style={{
                        color: '#cbd5e1',
                        fontSize: '.9rem'
                      }}
                    >
                      {student.first_name}{' '}
                      {student.last_name}
                    </p>

                    <span
                      style={{
                        color: '#64748b',
                        fontSize: '.8rem'
                      }}
                    >
                      {student.last_login
                        ? new Date(
                          student.last_login
                        ).toLocaleString()
                        : 'Never Logged In'}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      handleDelete(
                        student.id,
                        student.username
                      )
                    }
                    style={{
                      border: 'none',
                      padding:
                        '.8rem 1rem',
                      borderRadius: '12px',
                      background:
                        'linear-gradient(135deg,#ef4444,#dc2626)',
                      color: '#fff',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
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
        {title}
      </p>
    </div>
  );
}
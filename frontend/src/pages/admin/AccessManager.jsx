import { useState, useEffect } from 'react';

export default function AccessManager() {
  const [activeTab, setActiveTab] = useState('courses');
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);

  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  const [selectedLessons, setSelectedLessons] = useState(new Set());

  const [enrollments, setEnrollments] = useState([]);
  const [lessonAccess, setLessonAccess] = useState([]);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchLessons();
    fetchEnrollments();
    fetchLessonAccess();
  }, []);

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/students/`,
        { headers: authHeader }
      );
      if (res.ok) setStudents(await res.json());
    } catch { }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/courses/`, {
        headers: authHeader
      });
      if (res.ok) setCourses(await res.json());
    } catch { }
  };

  const fetchLessons = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/lessons/`, {
        headers: authHeader
      });
      if (res.ok) setLessons(await res.json());
    } catch { }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/enrollments/`,
        { headers: authHeader }
      );
      if (res.ok) setEnrollments(await res.json());
    } catch { }
  };

  const fetchLessonAccess = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lesson-access/`,
        { headers: authHeader }
      );
      if (res.ok) setLessonAccess(await res.json());
    } catch { }
  };

  const toggleSet = (setter, id) => {
    setter((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
      return newSet;
    });
  };

  const handleBulkSubmit = async () => {
    if (selectedStudents.size === 0) {
      setMessage('Please select at least one student.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      let endpoint = '';
      let payload = {};

      if (activeTab === 'courses') {
        if (selectedCourses.size === 0) {
          setMessage('Select at least one course.');
          setLoading(false);
          return;
        }

        endpoint = `${import.meta.env.VITE_API_URL}/api/enrollments/bulk_create/`;
        payload = {
          students: Array.from(selectedStudents),
          courses: Array.from(selectedCourses)
        };
      } else {
        if (selectedLessons.size === 0) {
          setMessage('Select at least one lesson.');
          setLoading(false);
          return;
        }

        endpoint = `${import.meta.env.VITE_API_URL}/api/lesson-access/bulk_create/`;
        payload = {
          students: Array.from(selectedStudents),
          lessons: Array.from(selectedLessons)
        };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();

        setMessage(`Success: ${data.detail}`);
        setSelectedStudents(new Set());
        setSelectedCourses(new Set());
        setSelectedLessons(new Set());

        activeTab === 'courses'
          ? fetchEnrollments()
          : fetchLessonAccess();
      } else {
        setMessage('Bulk assignment failed.');
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeEnrollment = async (id) => {
    if (!window.confirm('Revoke Course enrollment?')) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/enrollments/${id}/`,
        {
          method: 'DELETE',
          headers: authHeader
        }
      );

      if (res.ok) fetchEnrollments();
    } catch { }
  };

  const handleRevokeLesson = async (id) => {
    if (!window.confirm('Revoke Lesson access?')) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lesson-access/${id}/`,
        {
          method: 'DELETE',
          headers: authHeader
        }
      );

      if (res.ok) fetchLessonAccess();
    } catch { }
  };

  const cardStyle = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '22px',
    padding: '1.5rem',
    boxShadow: '0 20px 45px rgba(0,0,0,0.18)'
  };

  const listBox = {
    display: 'flex',
    flexDirection: 'column',
    gap: '.6rem',
    maxHeight: '360px',
    overflowY: 'auto',
    paddingRight: '.3rem'
  };

  const itemBox = {
    display: 'flex',
    alignItems: 'center',
    gap: '.7rem',
    padding: '.85rem',
    borderRadius: '14px',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '.92rem'
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            color: '#fff',
            fontSize: '1.9rem',
            fontWeight: '800',
            marginBottom: '.4rem'
          }}
        >
          Access Manager
        </h1>

        <p style={{ color: '#94a3b8' }}>
          Manage bulk enrollments and lesson unlocks.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '.8rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem'
        }}
      >
        {['courses', 'lessons'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setMessage('');
            }}
            style={{
              border: 'none',
              padding: '.9rem 1.3rem',
              borderRadius: '14px',
              cursor: 'pointer',
              color: '#fff',
              fontWeight: '700',
              background:
                activeTab === tab
                  ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                  : 'rgba(255,255,255,0.06)'
            }}
          >
            {tab === 'courses'
              ? 'Course Enrollments'
              : 'Lesson Unlocks'}
          </button>
        ))}
      </div>

      {/* Main Panel */}
      <div style={cardStyle}>
        <h3 style={{ color: '#fff', marginBottom: '.5rem' }}>
          Bulk Access Control
        </h3>

        <p
          style={{
            color: '#94a3b8',
            marginBottom: '1.5rem',
            fontSize: '.92rem'
          }}
        >
          Select students and assign multiple{' '}
          {activeTab === 'courses' ? 'courses' : 'lessons'} instantly.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
            gap: '1.2rem'
          }}
        >
          {/* Students */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem' }}>
              Students ({selectedStudents.size})
            </h4>

            <div style={listBox}>
              {students.map((s) => (
                <label key={s.id} style={itemBox}>
                  <input
                    type="checkbox"
                    checked={selectedStudents.has(s.id)}
                    onChange={() =>
                      toggleSet(setSelectedStudents, s.id)
                    }
                  />
                  {s.username} ({s.first_name || 'No Name'})
                </label>
              ))}
            </div>
          </div>

          {/* Targets */}
          <div>
            <h4 style={{ color: '#fff', marginBottom: '1rem' }}>
              {activeTab === 'courses'
                ? `Courses (${selectedCourses.size})`
                : `Lessons (${selectedLessons.size})`}
            </h4>

            <div style={listBox}>
              {activeTab === 'courses'
                ? courses.map((c) => (
                  <label key={c.id} style={itemBox}>
                    <input
                      type="checkbox"
                      checked={selectedCourses.has(c.id)}
                      onChange={() =>
                        toggleSet(setSelectedCourses, c.id)
                      }
                    />
                    {c.title}
                  </label>
                ))
                : lessons.map((l) => (
                  <label key={l.id} style={itemBox}>
                    <input
                      type="checkbox"
                      checked={selectedLessons.has(l.id)}
                      onChange={() =>
                        toggleSet(setSelectedLessons, l.id)
                      }
                    />
                    Day {l.day_number}: {l.title}
                  </label>
                ))}
            </div>
          </div>
        </div>

        {message && (
          <div
            style={{
              marginTop: '1.2rem',
              color: message.includes('Success')
                ? '#10b981'
                : '#f87171',
              fontWeight: '600'
            }}
          >
            {message}
          </div>
        )}

        <button
          onClick={handleBulkSubmit}
          disabled={loading}
          style={{
            marginTop: '1.4rem',
            border: 'none',
            padding: '1rem 1.4rem',
            borderRadius: '14px',
            color: '#fff',
            fontWeight: '700',
            cursor: 'pointer',
            background:
              'linear-gradient(135deg,#3b82f6,#8b5cf6)'
          }}
        >
          {loading ? 'Processing...' : 'Execute Bulk Assignment'}
        </button>
      </div>

      {/* Logs */}
      <div style={{ ...cardStyle, marginTop: '1.5rem' }}>
        <h3 style={{ color: '#fff', marginBottom: '1rem' }}>
          Active Logs
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '.9rem'
          }}
        >
          {activeTab === 'courses'
            ? enrollments.map((e) => {
              const student =
                students.find((s) => s.id === e.student)
                  ?.username || e.student;

              const course =
                courses.find((c) => c.id === e.course)?.title ||
                e.course;

              return (
                <LogCard
                  key={e.id}
                  title={student}
                  subtitle={`Enrolled in ${course}`}
                  action="Revoke"
                  onClick={() =>
                    handleRevokeEnrollment(e.id)
                  }
                />
              );
            })
            : lessonAccess.map((r) => {
              const student =
                students.find((s) => s.id === r.student)
                  ?.username || r.student;

              const lesson =
                lessons.find((l) => l.id === r.lesson);

              return (
                <LogCard
                  key={r.id}
                  title={student}
                  subtitle={`Unlocked Day ${lesson?.day_number}: ${lesson?.title}`}
                  action="Re-Lock"
                  onClick={() =>
                    handleRevokeLesson(r.id)
                  }
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

function LogCard({ title, subtitle, action, onClick }) {
  return (
    <div
      style={{
        padding: '1rem',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <div>
        <strong style={{ color: '#fff' }}>{title}</strong>
        <p style={{ color: '#94a3b8', marginTop: '.3rem' }}>
          {subtitle}
        </p>
      </div>

      <button
        onClick={onClick}
        style={{
          border: 'none',
          padding: '.8rem 1rem',
          borderRadius: '12px',
          background: 'linear-gradient(135deg,#ef4444,#dc2626)',
          color: '#fff',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        {action}
      </button>
    </div>
  );
}
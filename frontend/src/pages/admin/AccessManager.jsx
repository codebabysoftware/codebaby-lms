import { useState, useEffect } from 'react';
import { Users, BookOpen, Key, CheckSquare, Square, Trash2, ShieldCheck, ListChecks } from 'lucide-react';

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

  const allStudentsSelected = students.length > 0 && selectedStudents.size === students.length;

  const handleSelectAllStudents = () => {
    if (allStudentsSelected) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map((s) => s.id)));
    }
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

  const listBox = {
    display: 'flex',
    flexDirection: 'column',
    gap: '.6rem',
    maxHeight: '360px',
    overflowY: 'auto',
    paddingRight: '.5rem'
  };

  return (
    <div style={{ padding: '0.5rem', animation: 'slideUpFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            color: '#fff',
            fontSize: '2.2rem',
            fontWeight: '800',
            marginBottom: '.5rem',
            letterSpacing: '-0.5px'
          }}
        >
          Access Manager
        </h1>

        <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
          Manage bulk enrollments and lesson unlocks.
        </p>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          background: 'rgba(255,255,255,0.03)',
          padding: '0.5rem',
          borderRadius: '16px',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'inline-flex'
        }}
      >
        {[
          { id: 'courses', label: 'Course Enrollments', icon: BookOpen },
          { id: 'lessons', label: 'Lesson Unlocks', icon: Key }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMessage('');
              }}
              style={{
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                color: isActive ? '#fff' : '#94a3b8',
                fontWeight: '600',
                fontSize: '0.95rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: isActive
                  ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                  : 'transparent',
                boxShadow: isActive ? '0 8px 16px rgba(59, 130, 246, 0.25)' : 'none',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = '#94a3b8';
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Panel */}
      <div 
        className="premium-glass" 
        style={{ 
          borderRadius: '24px', 
          padding: '2rem',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '8px', borderRadius: '10px', color: '#3b82f6' }}>
            <ShieldCheck size={20} />
          </div>
          <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 700, color: '#fff' }}>
            Bulk Access Control
          </h3>
        </div>

        <p
          style={{
            color: '#94a3b8',
            marginBottom: '2rem',
            fontSize: '0.95rem'
          }}
        >
          Select students and assign multiple{' '}
          {activeTab === 'courses' ? 'courses' : 'lessons'} instantly.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}
        >
          {/* Students Column */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={18} color="#3b82f6" />
                <h4 style={{ color: '#fff', margin: 0, fontSize: '1.1rem' }}>
                  Students <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 'normal' }}>({selectedStudents.size}/{students.length})</span>
                </h4>
              </div>
              
              <button
                onClick={handleSelectAllStudents}
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  color: '#3b82f6',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'}
              >
                <ListChecks size={14} />
                {allStudentsSelected ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div style={listBox} className="custom-scrollbar">
              {students.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No students found.</div>
              ) : (
                students.map((s) => {
                  const isSelected = selectedStudents.has(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleSet(setSelectedStudents, s.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isSelected ? 'rgba(59, 130, 246, 0.3)' : 'transparent'}`,
                        color: isSelected ? '#fff' : '#cbd5e1',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                    >
                      {isSelected ? <CheckSquare size={20} color="#3b82f6" /> : <Square size={20} color="#64748b" />}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: isSelected ? 600 : 500 }}>{s.username}</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{s.first_name || 'No Name'}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Targets Column */}
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
              {activeTab === 'courses' ? <BookOpen size={18} color="#8b5cf6" /> : <Key size={18} color="#10b981" />}
              <h4 style={{ color: '#fff', margin: 0, fontSize: '1.1rem' }}>
                {activeTab === 'courses' ? 'Courses' : 'Lessons'}
                <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 'normal', marginLeft: '6px' }}>
                  ({activeTab === 'courses' ? selectedCourses.size : selectedLessons.size} selected)
                </span>
              </h4>
            </div>

            <div style={listBox} className="custom-scrollbar">
              {activeTab === 'courses'
                ? courses.map((c) => {
                  const isSelected = selectedCourses.has(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleSet(setSelectedCourses, c.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isSelected ? 'rgba(139, 92, 246, 0.3)' : 'transparent'}`,
                        color: isSelected ? '#fff' : '#cbd5e1',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                    >
                      {isSelected ? <CheckSquare size={20} color="#8b5cf6" /> : <Square size={20} color="#64748b" />}
                      <span style={{ fontWeight: isSelected ? 600 : 500 }}>{c.title}</span>
                    </div>
                  );
                })
                : lessons.map((l) => {
                  const isSelected = selectedLessons.has(l.id);
                  return (
                    <div
                      key={l.id}
                      onClick={() => toggleSet(setSelectedLessons, l.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.85rem 1rem',
                        borderRadius: '12px',
                        background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isSelected ? 'rgba(16, 185, 129, 0.3)' : 'transparent'}`,
                        color: isSelected ? '#fff' : '#cbd5e1',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                      }}
                    >
                      {isSelected ? <CheckSquare size={20} color="#10b981" /> : <Square size={20} color="#64748b" />}
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: isSelected ? 600 : 500 }}>{l.title}</span>
                        <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Day {l.day_number}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {message && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '1rem',
              borderRadius: '12px',
              background: message.includes('Success') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: message.includes('Success') ? '#10b981' : '#ef4444',
              border: `1px solid ${message.includes('Success') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
              textAlign: 'center',
              fontWeight: '600'
            }}
          >
            {message}
          </div>
        )}

        <button
          onClick={handleBulkSubmit}
          disabled={loading}
          className="btn-premium"
          style={{ width: '100%', justifyContent: 'center', marginTop: '2rem', padding: '1.2rem', fontSize: '1.05rem' }}
        >
          {loading ? 'Processing...' : `Assign to ${selectedStudents.size} Students`}
        </button>
      </div>

      {/* Logs */}
      <div 
        className="premium-glass"
        style={{ 
          marginTop: '2rem',
          borderRadius: '24px', 
          padding: '2rem',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)' 
        }}
      >
        <h3 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: '1.3rem' }}>
          Active Access Logs
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          {activeTab === 'courses' ? (
            enrollments.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>No active enrollments found.</p>
            ) : (
              enrollments.map((e) => {
                const student = students.find((s) => s.id === e.student)?.username || e.student;
                const course = courses.find((c) => c.id === e.course)?.title || e.course;

                return (
                  <LogCard
                    key={e.id}
                    title={student}
                    subtitle={`Enrolled in ${course}`}
                    onClick={() => handleRevokeEnrollment(e.id)}
                  />
                );
              })
            )
          ) : (
            lessonAccess.length === 0 ? (
              <p style={{ color: '#94a3b8', textAlign: 'center', padding: '1rem' }}>No active lesson unlocks found.</p>
            ) : (
              lessonAccess.map((r) => {
                const student = students.find((s) => s.id === r.student)?.username || r.student;
                const lesson = lessons.find((l) => l.id === r.lesson);

                return (
                  <LogCard
                    key={r.id}
                    title={student}
                    subtitle={`Unlocked Day ${lesson?.day_number}: ${lesson?.title}`}
                    onClick={() => handleRevokeLesson(r.id)}
                  />
                );
              })
            )
          )}
        </div>
      </div>
    </div>
  );
}

function LogCard({ title, subtitle, onClick }) {
  return (
    <div
      style={{
        padding: '1.25rem 1.5rem',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
        transition: 'background 0.2s ease'
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: 700, fontSize: '0.9rem' }}>
          {title.charAt(0).toUpperCase()}
        </div>
        <div>
          <strong style={{ color: '#fff', fontSize: '1.05rem', display: 'block', marginBottom: '4px' }}>{title}</strong>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>
            {subtitle}
          </p>
        </div>
      </div>

      <button
        onClick={onClick}
        style={{
          border: '1px solid rgba(239, 68, 68, 0.3)',
          padding: '0.6rem 1rem',
          borderRadius: '10px',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#ef4444',
          fontWeight: '600',
          fontSize: '0.85rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg,#ef4444,#dc2626)';
          e.currentTarget.style.color = '#fff';
          e.currentTarget.style.borderColor = 'transparent';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
          e.currentTarget.style.color = '#ef4444';
          e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
        }}
      >
        <Trash2 size={16} />
        Revoke
      </button>
    </div>
  );
}
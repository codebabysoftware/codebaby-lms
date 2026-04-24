import { useState, useEffect } from 'react';

export default function AccessManager() {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'lessons'
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  
  // Bulk selection maps (Sets of IDs)
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [selectedCourses, setSelectedCourses] = useState(new Set());
  const [selectedLessons, setSelectedLessons] = useState(new Set());

  // Records tracking for display
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

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/students/', { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }});
      if (res.ok) setStudents(await res.json());
    } catch(e) {}
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/courses/', { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }});
      if (res.ok) setCourses(await res.json());
    } catch(e) {}
  };

  const fetchLessons = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/lessons/', { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }});
      if (res.ok) setLessons(await res.json());
    } catch(e) {}
  };

  const fetchEnrollments = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/enrollments/', { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }});
      if (res.ok) setEnrollments(await res.json());
    } catch(e) {}
  };

  const fetchLessonAccess = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/lesson-access/', { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }});
      if (res.ok) setLessonAccess(await res.json());
    } catch(e) {}
  };

  const toggleSet = (setter, id) => {
    setter(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleBulkSubmit = async () => {
    if (selectedStudents.size === 0) {
      setMessage("Please select at least one student.");
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      let endpoint = '';
      let payload = {};

      if (activeTab === 'courses') {
        if (selectedCourses.size === 0) { setMessage("Select at least one course."); setLoading(false); return; }
        endpoint = `${import.meta.env.VITE_API_BASE_URL}/enrollments/bulk_create/';
        payload = { students: Array.from(selectedStudents), courses: Array.from(selectedCourses) };
      } else {
        if (selectedLessons.size === 0) { setMessage("Select at least one lesson."); setLoading(false); return; }
        endpoint = `${import.meta.env.VITE_API_BASE_URL}/lesson-access/bulk_create/';
        payload = { students: Array.from(selectedStudents), lessons: Array.from(selectedLessons) };
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(`Success: ${data.detail}`);
        // Clear selections
        setSelectedStudents(new Set());
        setSelectedCourses(new Set());
        setSelectedLessons(new Set());
        // Refresh grids
        if (activeTab === 'courses') fetchEnrollments();
        else fetchLessonAccess();
      } else {
        setMessage("Bulk assignment failed.");
      }
    } catch (err) {
      setMessage("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeEnrollment = async (id) => {
    if(!window.confirm("Revoke Course enrollment?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/enrollments/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } });
      if(res.ok) fetchEnrollments();
    } catch(e) {}
  };

  const handleRevokeLesson = async (id) => {
    if(!window.confirm("Revoke Lesson access?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/lesson-access/${id}/`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` } });
      if(res.ok) fetchLessonAccess();
    } catch(e) {}
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => { setActiveTab('courses'); setMessage(''); }} 
          className="btn-primary" 
          style={{ width: 'auto', margin: 0, background: activeTab === 'courses' ? 'var(--accent-color)' : 'var(--bg-secondary)' }}
        >
          Course Enrollments
        </button>
        <button 
          onClick={() => { setActiveTab('lessons'); setMessage(''); }} 
          className="btn-primary" 
          style={{ width: 'auto', margin: 0, background: activeTab === 'lessons' ? 'var(--accent-color)' : 'var(--bg-secondary)' }}
        >
          Lesson Unlocks
        </button>
      </div>

      <div className="glass-panel">
        <h3>Bulk Access Manager ({activeTab === 'courses' ? 'Courses' : 'Lessons'})</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
          Select multiple students, then select the items you want to grant them access to.
        </p>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          
          {/* Students Column */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h4 style={{ marginBottom: '1rem' }}>1. Select Students ({selectedStudents.size})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '1rem' }}>
              {students.map(s => (
                <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '4px' }}>
                  <input type="checkbox" checked={selectedStudents.has(s.id)} onChange={() => toggleSet(setSelectedStudents, s.id)} />
                  {s.username} ({s.first_name || 'No Name'})
                </label>
              ))}
            </div>
          </div>

          {/* Targets Column */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <h4 style={{ marginBottom: '1rem' }}>
              2. Select {activeTab === 'courses' ? 'Courses' : 'Lessons'} 
              {activeTab === 'courses' ? ` (${selectedCourses.size})` : ` (${selectedLessons.size})`}
            </h4>
            
            {activeTab === 'courses' ? (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '1rem' }}>
                 {courses.map(c => (
                   <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '4px' }}>
                     <input type="checkbox" checked={selectedCourses.has(c.id)} onChange={() => toggleSet(setSelectedCourses, c.id)} />
                     {c.title}
                   </label>
                 ))}
               </div>
            ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '1rem' }}>
                 {lessons.map(l => (
                   <label key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', background: 'var(--bg-secondary)', padding: '0.5rem', borderRadius: '4px' }}>
                     <input type="checkbox" checked={selectedLessons.has(l.id)} onChange={() => toggleSet(setSelectedLessons, l.id)} />
                     Day {l.day_number}: {l.title}
                   </label>
                 ))}
               </div>
            )}
          </div>
        </div>

        {message && <div style={{ color: message.includes('Success') ? 'var(--accent-hover)' : 'var(--danger-color)', marginBottom: '1rem' }}>{message}</div>}

        <button onClick={handleBulkSubmit} className="btn-primary" style={{ width: 'auto', margin: 0 }} disabled={loading}>
          {loading ? 'Processing...' : 'Execute Bulk Assignment'}
        </button>
      </div>

      {/* Audit Log / Existing Mappings */}
      <div className="glass-panel" style={{ marginTop: '2rem' }}>
        <h4 style={{ marginBottom: '1rem' }}>Active {activeTab === 'courses' ? 'Enrollments' : 'Unlocked Lessons'} Logs</h4>
        
        {activeTab === 'courses' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {enrollments.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No enrollments exist.</p> : enrollments.map(e => {
              const student = students.find(s => s.id === e.student)?.username || e.student;
              const course = courses.find(c => c.id === e.course)?.title || e.course;
              return (
                <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '6px' }}>
                  <div><strong>Student: {student}</strong><br /><span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Course Enrolled: {course}</span></div>
                  <button onClick={() => handleRevokeEnrollment(e.id)} className="btn-primary" style={{ width: 'auto', background: 'var(--danger-color)', margin: 0, padding: '0.25rem 0.75rem' }}>Revoke</button>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {lessonAccess.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No lesson locks cleared yet.</p> : lessonAccess.map(record => {
              const student = students.find(s => s.id === record.student)?.username || record.student;
              const lessonObj = lessons.find(l => l.id === record.lesson);
              const lessonStr = lessonObj ? `Day ${lessonObj.day_number}: ${lessonObj.title}` : record.lesson;
              return (
                <div key={record.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '6px' }}>
                  <div><strong>Student: {student}</strong><br /><span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Lesson Unlocked: {lessonStr}</span></div>
                  <button onClick={() => handleRevokeLesson(record.id)} className="btn-primary" style={{ width: 'auto', background: 'var(--danger-color)', margin: 0, padding: '0.25rem 0.75rem' }}>Re-Lock</button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

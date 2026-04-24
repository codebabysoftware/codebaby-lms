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

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` };
      
      const statsRes = await fetch(`http://localhost:8000/api/admin/analytics/', { headers });
      if (statsRes.ok) setAnalytics(await statsRes.json());
      
      const studentsRes = await fetch(`http://localhost:8000/api/admin/students/', { headers });
      if (studentsRes.ok) setStudents(await studentsRes.json());
    } catch(e) {}
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const res = await fetch(`http://localhost:8000/api/admin/students/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          username,
          password,
          first_name: firstName,
          last_name: lastName
        })
      });

      if (res.ok) {
        setMessage('Student successfully created!');
        setUsername(''); setPassword(''); setFirstName(''); setLastName('');
        fetchData();
      } else {
        const errData = await res.json();
        setMessage('Creation Failed: ' + JSON.stringify(errData));
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if(!window.confirm(`DANGER: Are you absolutely sure you want to delete the student "${name}"? This action irreversibly wipes all their historical data, enrollments, and access records.`)) {
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:8000/api/admin/students/${id}/delete/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });

      if (res.ok) {
        setMessage(`Student "${name}" was permanently deleted.`);
        fetchData();
      } else {
        setMessage("Failed to execute deletion protocol.");
      }
    } catch(e) {
      setMessage("Network error during deletion.");
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      
      {/* 1. Analytics Dashboard Top Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-color)', marginBottom: '0.25rem' }}>{analytics.total_students}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Students</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--accent-hover)', marginBottom: '0.25rem' }}>{analytics.active_students}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Active (7 Days)</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#ffb347', marginBottom: '0.25rem' }}>{analytics.total_enrollments}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Course Enrollments</p>
        </div>
        <div className="glass-panel" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#4caf50', marginBottom: '0.25rem' }}>{analytics.total_lesson_unlocks}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase' }}>Lessons Unlocked</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* 2. Manual Student Creation Node */}
        <div className="glass-panel" style={{ flex: '1', minWidth: '340px' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Manually Issue ID</h3>
          <form onSubmit={handleCreateStudent}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Username / ID Fragment</label>
              <input type="text" className="input-field" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Temporary Password</label>
              <input type="text" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: '1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>First Name</label>
                <input type="text" className="input-field" value={firstName} onChange={e => setFirstName(e.target.value)} />
              </div>
              <div style={{ flex: '1' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Last Name</label>
                <input type="text" className="input-field" value={lastName} onChange={e => setLastName(e.target.value)} />
              </div>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Processing...' : 'Register Student'}
            </button>
            {message && <div style={{ marginTop: '1rem', color: message.includes('success') || message.includes('deleted') ? 'var(--accent-hover)' : 'var(--danger-color)' }}>{message}</div>}
          </form>
        </div>

        {/* 3. Detailed Data Table (Replacing generic loop map) */}
        <div className="glass-panel" style={{ flex: '2', minWidth: '500px', overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Student Roster</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '0.75rem', fontWeight: 500 }}>ID (Username)</th>
                <th style={{ padding: '0.75rem', fontWeight: 500 }}>Full Name</th>
                <th style={{ padding: '0.75rem', fontWeight: 500 }}>Last Login</th>
                <th style={{ padding: '0.75rem', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No students actively registered.</td></tr>
              ) : students.map(student => (
                <tr key={student.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', animation: 'slideUpFadeIn 0.3s ease-out forwards' }}>
                  <td style={{ padding: '1rem 0.75rem', fontWeight: 'bold' }}>{student.username}</td>
                  <td style={{ padding: '1rem 0.75rem' }}>{student.first_name} {student.last_name}</td>
                  <td style={{ padding: '1rem 0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {student.last_login ? new Date(student.last_login).toLocaleString() : 'Never'}
                  </td>
                  <td style={{ padding: '1rem 0.75rem', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(student.id, student.username)} className="btn-primary" style={{ margin: 0, padding: '0.25rem 0.75rem', width: 'auto', fontSize: '0.875rem', background: 'var(--danger-color)' }}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

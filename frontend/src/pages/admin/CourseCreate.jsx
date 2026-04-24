import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CourseCreate() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/courses/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ title, description })
      });

      if (response.ok) {
        navigate('/admin/courses');
      } else {
        setError('Failed to create course');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="glass-panel" style={{ marginTop: '2rem', maxWidth: '600px' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Create New Course</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Course Title</label>
          <input 
            type="text" 
            className="input-field" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
          <textarea 
            className="input-field" 
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && <div className="error-text">{error}</div>}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" style={{ width: 'auto' }}>Create Course</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-primary" style={{ width: 'auto', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

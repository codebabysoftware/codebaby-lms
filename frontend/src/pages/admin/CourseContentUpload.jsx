import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function CourseContentUpload() {
  const { courseId } = useParams();
  const [title, setTitle] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [notesFile, setNotesFile] = useState(null);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('course', courseId);
    formData.append('title', title);
    if (videoFile) formData.append('video_file', videoFile);
    if (notesFile) formData.append('notes_file', notesFile);

    try {
      const response = await fetch('http://localhost:8000/api/content/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          // Do not set Content-Type, browser will automatically set multipart/form-data with bounds for FormData
        },
        body: formData
      });

      if (response.ok) {
        navigate('/admin/courses');
      } else {
        const errorData = await response.json();
        setError(JSON.stringify(errorData));
      }
    } catch (err) {
      setError('Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ marginTop: '2rem', maxWidth: '600px' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>Upload Module Content</h3>
      <form onSubmit={handleUpload}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Module Title</label>
          <input 
            type="text" 
            className="input-field" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Introduction to React Basics"
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Video File</label>
          <input 
            type="file" 
            accept="video/*"
            className="input-field" 
            style={{ padding: '0.5rem' }}
            onChange={(e) => setVideoFile(e.target.files[0])}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>PDF Notes</label>
          <input 
            type="file" 
            accept="application/pdf"
            className="input-field" 
            style={{ padding: '0.5rem' }}
            onChange={(e) => setNotesFile(e.target.files[0])}
          />
        </div>
        {error && <div className="error-text">{error}</div>}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Save Content'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-primary" style={{ width: 'auto', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

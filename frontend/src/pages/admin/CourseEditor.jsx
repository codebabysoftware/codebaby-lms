import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function CourseEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [moduleTitle, setModuleTitle] = useState('');
  
  // For lesson upload form
  const [activeModule, setActiveModule] = useState(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [videoFile, setVideoFile] = useState(null);
  const [notesFile, setNotesFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCourse = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/courses/${courseId}/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (res.ok) setCourse(await res.json());
    } catch(e) {}
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const handleCreateModule = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/modules/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({ course: courseId, title: moduleTitle, order: course?.modules?.length || 0 })
      });
      if (res.ok) {
        setModuleTitle('');
        fetchCourse();
      }
    } catch(e) {}
  };

  const handleUploadLesson = async (e) => {
    e.preventDefault();
    if (!activeModule) {
      setMessage('Please select a module to add a lesson to.');
      return;
    }

    setLoading(true);
    setMessage('');
    
    const formData = new FormData();
    formData.append('module', activeModule);
    formData.append('title', lessonTitle);
    formData.append('day_number', dayNumber);
    if (videoFile) formData.append('video_file', videoFile);
    if (notesFile) formData.append('notes_file', notesFile);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/lessons/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
      });

      if (res.ok) {
        setMessage('Lesson added successfully!');
        setLessonTitle('');
        setVideoFile(null);
        setNotesFile(null);
        setDayNumber(dayNumber + 1);
        fetchCourse();
      } else {
        setMessage('Failed to upload lesson.');
      }
    } catch (err) {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  if (!course) return <div style={{ padding: '2rem' }}>Loading Editor...</div>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <button onClick={() => navigate('/admin/courses')} className="btn-primary" style={{ width: 'auto', marginBottom: '1.5rem', background: 'var(--bg-secondary)' }}>
        ← Back to Courses
      </button>

      <h2>Managing: {course.title}</h2>
      
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1.5rem' }}>
        {/* Modules Column */}
        <div style={{ flex: '1' }}>
          <div className="glass-panel">
            <h3>1. Add Module</h3>
            <form onSubmit={handleCreateModule} style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <input type="text" className="input-field" placeholder="Module Title (e.g. Basics)" value={moduleTitle} onChange={e => setModuleTitle(e.target.value)} required />
              <button type="submit" className="btn-primary" style={{ margin: 0, width: '120px' }}>Add</button>
            </form>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            {course.modules?.map((m) => (
               <div key={m.id} className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem', border: activeModule === m.id ? '2px solid var(--accent-color)' : '1px solid var(--glass-border)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <h4>{m.title}</h4>
                   <button onClick={() => setActiveModule(m.id)} className="btn-primary" style={{ width: 'auto', margin: 0, padding: '0.25rem 0.5rem', background: activeModule === m.id ? 'var(--accent-color)' : 'var(--bg-secondary)' }}>
                     {activeModule === m.id ? 'Selected' : 'Select'}
                   </button>
                 </div>
                 
                 <div style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
                   {m.lessons?.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No lessons attached.</p> : (
                     <ul style={{ listStylePos: 'inside', color: 'var(--text-secondary)' }}>
                       {m.lessons?.map(l => (
                         <li key={l.id}>Day {l.day_number}: {l.title}</li>
                       ))}
                     </ul>
                   )}
                 </div>
               </div>
            ))}
          </div>
        </div>

        {/* Lesson Column */}
        <div style={{ flex: '1' }}>
          <div className="glass-panel" style={{ opacity: activeModule ? 1 : 0.5, pointerEvents: activeModule ? 'auto' : 'none' }}>
            <h3>2. Add Day-wise Lesson</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Requires a selected module from the left.
            </p>

            <form onSubmit={handleUploadLesson}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Day Number</label>
                <input type="number" className="input-field" value={dayNumber} onChange={e => setDayNumber(parseInt(e.target.value))} required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Lesson Title</label>
                <input type="text" className="input-field" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} required />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Video File (Optional)</label>
                <input type="file" className="input-field" accept="video/mp4" onChange={e => setVideoFile(e.target.files[0])} />
              </div>
               <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Notes PDF (Optional)</label>
                <input type="file" className="input-field" accept="application/pdf" onChange={e => setNotesFile(e.target.files[0])} />
              </div>

              {message && <div className="error-text" style={{ marginBottom: '1rem', color: message.includes('success') ? 'var(--accent-color)' : 'var(--danger-color)' }}>{message}</div>}

              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Uploading...' : 'Save Lesson'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SecureMediaFetcher from './SecureMediaFetcher';

export default function CourseViewer() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openModules, setOpenModules] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // SECURITY DETERRENCE MOUNT
    const preventContextMenu = (e) => e.preventDefault();
    const preventCopy = (e) => {
      // Prevent Ctrl+C, Ctrl+P, Windows Key + Shift + S, etc.
      if (
        (e.ctrlKey && ['c', 'p', 's'].includes(e.key.toLowerCase())) ||
        (e.metaKey && ['c', 'p', 's'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventCopy);

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventCopy);
    };
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/student-courses/${courseId}/`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (!data.is_unlocked_overall) {
            navigate('/student'); // kick out if locked completely
          } else {
            setCourse(data);
          }
        }
      } catch (err) {}
    };
    fetchCourse();
  }, [courseId, navigate]);

  const toggleModule = (modId) => {
    setOpenModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleLessonSelect = (lesson) => {
    if (lesson.is_unlocked) {
      setSelectedLesson(lesson);
    } else {
      alert("You do not have access to this lesson yet.");
    }
  };

  if (!course) return <div style={{ padding: '2rem' }}>Loading course...</div>;

  return (
    <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', height: 'calc(100vh - 150px)' }}>
      {/* Sidebar for Modules & Lessons API */}
      <div className="glass-panel" style={{ width: '300px', overflowY: 'auto', padding: '1rem' }}>
        <h3 style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>Syllabus</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {course.modules?.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No content available.</p> : (
            course.modules.map((module) => (
              <div key={module.id} style={{ border: '1px solid var(--glass-border)', borderRadius: '6px', overflow: 'hidden' }}>
                <button 
                  onClick={() => toggleModule(module.id)}
                  style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--bg-secondary)', color: 'white', border: 'none', textAlign: 'left', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                >
                  <span>{module.title}</span>
                  <span>{openModules[module.id] ? '▼' : '▶'}</span>
                </button>
                
                {openModules[module.id] && (
                  <div style={{ padding: '0.5rem', background: 'var(--bg-primary)' }}>
                    {module.lessons?.length === 0 ? <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No lessons.</p> : (
                      module.lessons.map(lesson => (
                         <button 
                            key={lesson.id} 
                            onClick={() => handleLessonSelect(lesson)}
                            style={{ 
                              width: '100%', 
                              padding: '0.5rem', 
                              marginBottom: '0.25rem',
                              background: selectedLesson?.id === lesson.id ? 'var(--accent-hover)' : 'transparent',
                              color: lesson.is_unlocked ? 'var(--text-primary)' : 'var(--text-secondary)',
                              border: 'none', 
                              textAlign: 'left',
                              cursor: lesson.is_unlocked ? 'pointer' : 'not-allowed',
                              borderRadius: '4px',
                              display: 'flex',
                              justifyContent: 'space-between'
                            }}
                          >
                            <span>Day {lesson.day_number}: {lesson.title}</span>
                            {!lesson.is_unlocked && <span>🔒</span>}
                          </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div className="glass-panel" style={{ flex: '1', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>{course.title}</h2>
          <button onClick={() => navigate('/student')} className="btn-primary" style={{ width: 'auto', margin: 0, background: 'var(--bg-secondary)' }}>Back to Library</button>
        </div>

        {!selectedLesson ? (
          <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
            Select an unlocked lesson from the syllabus to start learning.
          </div>
        ) : (
          <div>
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>{selectedLesson.title}</h3>
            
            <div style={{ marginBottom: '2rem' }}>
              <h4>Video Lecture</h4>
              <SecureMediaFetcher contentId={selectedLesson.id} type="video" title={selectedLesson.title} />
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <h4>Attached Notes</h4>
              <SecureMediaFetcher contentId={selectedLesson.id} type="notes" title={selectedLesson.title} />
            </div>
            
            {/* Future Performance Check Hook */}
            <div style={{ marginTop: '2rem', padding: '1.5rem', border: '1px dashed var(--accent-color)', borderRadius: '8px', textAlign: 'center' }}>
              <h4 style={{ color: 'var(--text-secondary)' }}>Performance Check Module</h4>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Diagnostic tests and analyzing tools are currently pending activation for this lesson.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

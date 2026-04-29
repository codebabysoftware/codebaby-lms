import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Hooks
function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export default function CourseViewer() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width < 1000;

  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openModules, setOpenModules] = useState({});

  useEffect(() => {
    const preventContextMenu = (e) => e.preventDefault();
    const preventCopy = (e) => {
      if ((e.ctrlKey && ['c', 'p', 's'].includes(e.key.toLowerCase())) || (e.metaKey && ['c', 'p', 's'].includes(e.key.toLowerCase()))) {
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/student-courses/${courseId}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (!data.is_unlocked_overall) {
            navigate('/student');
          } else {
            setCourse(data);
          }
        }
      } catch { }
    };
    fetchCourse();
  }, [courseId, navigate]);

  const toggleModule = (modId) => {
    setOpenModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleLessonSelect = (lesson) => {
    if (lesson.is_unlocked) {
      setSelectedLesson(lesson);
      if (isMobile) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      alert('You do not have access to this lesson yet.');
    }
  };

  if (!course) {
    return (
      <div style={{ display: 'flex', height: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <div className="shimmer-bg" style={{ width: '200px', height: '20px', borderRadius: '10px' }}></div>
      </div>
    );
  }

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: isMobile ? '1fr' : '350px minmax(0, 1fr)', 
      gap: '2rem', 
      animation: 'slideUpFadeIn 0.5s ease-out',
      minHeight: '100vh'
    }}>
      {/* Sidebar - Syllabus */}
      <div 
        className="premium-glass" 
        style={{ 
          padding: isMobile ? '1.5rem' : '2rem', 
          borderRadius: '32px', 
          height: 'fit-content', 
          position: isMobile ? 'relative' : 'sticky', 
          top: isMobile ? '0' : '100px',
          order: isMobile ? 2 : 1
        }}
      >
        <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem', fontFamily: 'var(--font-display)' }}>
          Course Syllabus
        </h2>

        {course.modules?.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No modules available.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {course.modules.map((module) => (
              <div key={module.id} style={{ borderRadius: '20px', overflow: 'hidden', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}>
                <button
                  onClick={() => toggleModule(module.id)}
                  style={{
                    width: '100%',
                    border: 'none',
                    padding: '1.2rem',
                    background: openModules[module.id] ? 'rgba(255,255,255,0.05)' : 'transparent',
                    color: '#fff',
                    fontWeight: '700',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: '0.3s'
                  }}
                >
                  <span style={{ fontSize: '1rem', textAlign: 'left' }}>{module.title}</span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--accent-secondary)' }}>{openModules[module.id] ? '−' : '+'}</span>
                </button>

                {openModules[module.id] && (
                  <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)' }}>
                    {module.lessons?.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '0.5rem' }}>No lessons.</p>
                    ) : (
                      module.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => handleLessonSelect(lesson)}
                          style={{
                            width: '100%',
                            marginBottom: '0.6rem',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '14px',
                            textAlign: 'left',
                            cursor: lesson.is_unlocked ? 'pointer' : 'not-allowed',
                            background: selectedLesson?.id === lesson.id ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.03)',
                            color: lesson.is_unlocked ? '#fff' : 'var(--text-muted)',
                            fontWeight: '600',
                            fontSize: '0.92rem',
                            transition: '0.2s',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{ flex: 1, paddingRight: '1rem' }}>Day {lesson.day_number}: {lesson.title}</span>
                          {!lesson.is_unlocked && <span>🔒</span>}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div 
        className="premium-glass" 
        style={{ 
          padding: isMobile ? '1.5rem' : '3rem', 
          borderRadius: '32px',
          order: isMobile ? 1 : 2
        }}
      >
        {!selectedLesson ? (
          <div style={{ height: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎯</div>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>Ready to start?</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', lineHeight: '1.6' }}>Select a lesson from the syllabus to begin your immersive learning experience.</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <span style={{ color: 'var(--accent-secondary)', fontWeight: '800', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                  {course.modules.find(m => m.lessons.some(l => l.id === selectedLesson.id))?.title}
                </span>
                <h1 style={{ color: '#fff', fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '900', marginTop: '0.5rem', fontFamily: 'var(--font-display)', lineHeight: '1.2' }}>
                  {selectedLesson.title}
                </h1>
              </div>
              <button onClick={() => navigate('/student')} className="btn-secondary-premium" style={{ padding: '0.6rem 1.2rem' }}>← Back</button>
            </div>

            {/* Video Section */}
            <section style={{ marginBottom: '4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '700' }}>Cinematic Lecture</h3>
              </div>

              {selectedLesson.video_url ? (
                <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: '24px', overflow: 'hidden', background: '#000', boxShadow: '0 30px 60px rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)' }}>
                  <iframe src={selectedLesson.video_url} loading="lazy" allowFullScreen style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }} />
                </div>
              ) : (
                <EmptyBox text="No video available for this lesson." />
              )}
            </section>

            {/* Resources */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <section>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.5rem' }}>Learning Resources</h3>
                {selectedLesson.notes_url ? (
                  <a href={selectedLesson.notes_url} target="_blank" rel="noopener noreferrer" className="btn-premium" style={{ width: 'fit-content', textDecoration: 'none' }}>
                    📄 View Premium Notes
                  </a>
                ) : (
                  <EmptyBox text="No notes available." />
                )}
              </section>

              <section className="premium-glass" style={{ padding: '1.5rem', borderRadius: '24px', background: 'rgba(59,130,246,0.05)' }}>
                <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.8rem' }}>AI Diagnostics</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>Personalized quiz and performance tracking for this lesson will be available soon.</p>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyBox({ text }) {
  return (
    <div style={{ padding: '2rem', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', color: 'var(--text-muted)', textAlign: 'center', border: '1px dashed var(--glass-border)' }}>
      {text}
    </div>
  );
}
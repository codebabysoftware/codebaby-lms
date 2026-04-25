import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SecureMediaFetcher from './SecureMediaFetcher';

export default function CourseViewer() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openModules, setOpenModules] = useState({});

  useEffect(() => {
    const preventContextMenu = (e) => e.preventDefault();

    const preventCopy = (e) => {
      if (
        (e.ctrlKey &&
          ['c', 'p', 's'].includes(
            e.key.toLowerCase()
          )) ||
        (e.metaKey &&
          ['c', 'p', 's'].includes(
            e.key.toLowerCase()
          ))
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener(
      'contextmenu',
      preventContextMenu
    );
    document.addEventListener(
      'keydown',
      preventCopy
    );

    return () => {
      document.removeEventListener(
        'contextmenu',
        preventContextMenu
      );
      document.removeEventListener(
        'keydown',
        preventCopy
      );
    };
  }, []);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/student-courses/${courseId}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                'access_token'
              )}`
            }
          }
        );

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
    setOpenModules((prev) => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const handleLessonSelect = (lesson) => {
    if (lesson.is_unlocked) {
      setSelectedLesson(lesson);
    } else {
      alert(
        'You do not have access to this lesson yet.'
      );
    }
  };

  if (!course) {
    return (
      <div
        style={{
          padding: '2rem',
          color: '#fff'
        }}
      >
        Loading course...
      </div>
    );
  }

  const glass = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(18px)',
    border:
      '1px solid rgba(255,255,255,0.08)',
    borderRadius: '22px',
    boxShadow:
      '0 20px 45px rgba(0,0,0,0.18)'
  };

  const button = {
    border: 'none',
    padding: '.85rem 1rem',
    borderRadius: '14px',
    cursor: 'pointer',
    fontWeight: '700',
    color: '#fff'
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns:
          '320px minmax(0,1fr)',
        gap: '1.5rem',
        minHeight: 'calc(100vh - 140px)'
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          ...glass,
          padding: '1.2rem',
          overflowY: 'auto'
        }}
      >
        <h2
          style={{
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: '800',
            marginBottom: '1rem'
          }}
        >
          Course Syllabus
        </h2>

        {course.modules?.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>
            No modules available.
          </p>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '.9rem'
            }}
          >
            {course.modules.map(
              (module) => (
                <div
                  key={module.id}
                  style={{
                    border:
                      '1px solid rgba(255,255,255,0.08)',
                    borderRadius:
                      '16px',
                    overflow:
                      'hidden',
                    background:
                      'rgba(255,255,255,0.03)'
                  }}
                >
                  <button
                    onClick={() =>
                      toggleModule(
                        module.id
                      )
                    }
                    style={{
                      width: '100%',
                      border: 'none',
                      padding:
                        '1rem',
                      background:
                        'rgba(255,255,255,0.05)',
                      color: '#fff',
                      fontWeight:
                        '700',
                      display:
                        'flex',
                      justifyContent:
                        'space-between',
                      cursor:
                        'pointer'
                    }}
                  >
                    <span>
                      {
                        module.title
                      }
                    </span>

                    <span>
                      {openModules[
                        module.id
                      ]
                        ? '−'
                        : '+'}
                    </span>
                  </button>

                  {openModules[
                    module.id
                  ] && (
                      <div
                        style={{
                          padding:
                            '.75rem'
                        }}
                      >
                        {module.lessons
                          ?.length ===
                          0 ? (
                          <p
                            style={{
                              color:
                                '#94a3b8',
                              fontSize:
                                '.9rem'
                            }}
                          >
                            No
                            lessons.
                          </p>
                        ) : (
                          module.lessons.map(
                            (
                              lesson
                            ) => (
                              <button
                                key={
                                  lesson.id
                                }
                                onClick={() =>
                                  handleLessonSelect(
                                    lesson
                                  )
                                }
                                style={{
                                  width:
                                    '100%',
                                  marginBottom:
                                    '.55rem',
                                  border:
                                    'none',
                                  padding:
                                    '.8rem',
                                  borderRadius:
                                    '12px',
                                  textAlign:
                                    'left',
                                  cursor:
                                    lesson.is_unlocked
                                      ? 'pointer'
                                      : 'not-allowed',
                                  background:
                                    selectedLesson?.id ===
                                      lesson.id
                                      ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                                      : 'rgba(255,255,255,0.04)',
                                  color:
                                    lesson.is_unlocked
                                      ? '#fff'
                                      : '#64748b',
                                  fontWeight:
                                    '600'
                                }}
                              >
                                Day{' '}
                                {
                                  lesson.day_number
                                }

                                :{' '}
                                {
                                  lesson.title
                                }{' '}
                                {!lesson.is_unlocked &&
                                  ' 🔒'}
                              </button>
                            )
                          )
                        )}
                      </div>
                    )}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        style={{
          ...glass,
          padding: '1.5rem',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1.2rem'
          }}
        >
          <div>
            <h1
              style={{
                color: '#fff',
                fontSize:
                  '1.8rem',
                fontWeight:
                  '800',
                marginBottom:
                  '.35rem'
              }}
            >
              {course.title}
            </h1>

            <p
              style={{
                color:
                  '#94a3b8'
              }}
            >
              Premium
              learning
              workspace
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                '/student'
              )
            }
            style={{
              ...button,
              background:
                'rgba(255,255,255,0.06)'
            }}
          >
            ← Back
          </button>
        </div>

        {!selectedLesson ? (
          <div
            style={{
              minHeight:
                '420px',
              display:
                'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              color:
                '#94a3b8',
              textAlign:
                'center',
              padding:
                '2rem'
            }}
          >
            Select an unlocked lesson
            from the syllabus to start
            learning.
          </div>
        ) : (
          <div>
            {/* Lesson Header */}
            <div
              style={{
                marginBottom:
                  '1.5rem'
              }}
            >
              <span
                style={{
                  padding:
                    '.35rem .65rem',
                  borderRadius:
                    '999px',
                  background:
                    'rgba(59,130,246,.15)',
                  color:
                    '#60a5fa',
                  fontSize:
                    '.8rem',
                  fontWeight:
                    '700'
                }}
              >
                Day{' '}
                {
                  selectedLesson.day_number
                }
              </span>

              <h2
                style={{
                  color:
                    '#fff',
                  fontSize:
                    '1.5rem',
                  marginTop:
                    '.8rem'
                }}
              >
                {
                  selectedLesson.title
                }
              </h2>
            </div>

            {/* Video */}
            <section
              style={{
                marginBottom:
                  '2rem'
              }}
            >
              <h3
                style={{
                  color:
                    '#fff',
                  marginBottom:
                    '.8rem'
                }}
              >
                Video
                Lecture
              </h3>

              {selectedLesson.video_url ? (
                <div
                  style={{
                    position:
                      'relative',
                    paddingTop:
                      '56.25%',
                    borderRadius:
                      '18px',
                    overflow:
                      'hidden',
                    background:
                      '#000'
                  }}
                >
                  <iframe
                    src={
                      selectedLesson.video_url
                    }
                    loading="lazy"
                    allowFullScreen
                    style={{
                      position:
                        'absolute',
                      inset: 0,
                      width:
                        '100%',
                      height:
                        '100%',
                      border: 0
                    }}
                  />
                </div>
              ) : (
                <EmptyBox text="No video available for this lesson." />
              )}
            </section>

            {/* Notes */}
            <section
              style={{
                marginBottom:
                  '2rem'
              }}
            >
              <h3
                style={{
                  color:
                    '#fff',
                  marginBottom:
                    '.8rem'
                }}
              >
                Notes
              </h3>

              {selectedLesson.notes_url ? (
                <a
                  href={
                    selectedLesson.notes_url
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display:
                      'inline-flex',
                    textDecoration:
                      'none',
                    ...button,
                    background:
                      'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                  }}
                >
                  Open Notes
                </a>
              ) : (
                <EmptyBox text="No notes available." />
              )}
            </section>

            {/* Future Hook */}
            <section
              style={{
                padding:
                  '1.5rem',
                borderRadius:
                  '18px',
                border:
                  '1px dashed rgba(59,130,246,.45)',
                background:
                  'rgba(59,130,246,.05)'
              }}
            >
              <h3
                style={{
                  color:
                    '#fff',
                  marginBottom:
                    '.5rem'
                }}
              >
                Performance Check
              </h3>

              <p
                style={{
                  color:
                    '#94a3b8',
                  lineHeight:
                    '1.7'
                }}
              >
                Diagnostic tests and
                lesson analytics will
                be activated here in a
                future release.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyBox({ text }) {
  return (
    <div
      style={{
        padding: '1.25rem',
        borderRadius: '16px',
        background:
          'rgba(255,255,255,0.04)',
        color: '#94a3b8'
      }}
    >
      {text}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function CourseEditor() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [moduleTitle, setModuleTitle] = useState('');

  const [activeModule, setActiveModule] = useState(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [dayNumber, setDayNumber] = useState(1);
  const [bunnyVideoId, setBunnyVideoId] = useState('');
  const [notesUrl, setNotesUrl] = useState('');

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [preview, setPreview] = useState(null);

  const authHeader = {
    Authorization: `Bearer ${localStorage.getItem('access_token')}`
  };

  const fetchCourse = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses/${courseId}/`,
        { headers: authHeader }
      );

      if (res.ok) {
        const data = await res.json();
        setCourse(data);
        setEditTitle(data.title);
        setEditDescription(data.description || '');
        if (data.thumbnail_base64) {
          setPreview(data.thumbnail_base64);
        } else if (data.thumbnail) {
          setPreview(`${import.meta.env.VITE_API_URL}${data.thumbnail}`);
        }
      }
    } catch { }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const handleUpdateMetadata = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses/${courseId}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
            thumbnail_base64: editThumbnail || undefined
          })
        }
      );

      if (res.ok) {
        setMessage('Course details updated!');
        fetchCourse();
      } else {
        setMessage('Failed to update course details.');
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage('Image too large (max 2MB)');
        return;
      }
      setPreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/modules/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader
          },
          body: JSON.stringify({
            course: courseId,
            title: moduleTitle,
            order: course?.modules?.length || 0
          })
        }
      );

      if (res.ok) {
        setModuleTitle('');
        fetchCourse();
      }
    } catch { }
  };

  const handleUploadLesson = async (e) => {
    e.preventDefault();

    if (!activeModule) {
      setMessage('Please select a module first.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/lessons/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeader
          },
          body: JSON.stringify({
            module: activeModule,
            title: lessonTitle,
            day_number: dayNumber,
            bunny_video_id: bunnyVideoId || null,
            notes_url: notesUrl || null
          })
        }
      );

      if (res.ok) {
        setMessage('Lesson added successfully!');
        setLessonTitle('');
        setBunnyVideoId('');
        setNotesUrl('');
        setDayNumber(dayNumber + 1);
        fetchCourse();
      } else {
        setMessage('Failed to upload lesson.');
      }
    } catch {
      setMessage('Network error.');
    } finally {
      setLoading(false);
    }
  };

  if (!course)
    return (
      <div style={{ padding: '2rem', color: '#fff' }}>
        Loading Editor...
      </div>
    );

  const card = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '22px',
    padding: '1.5rem',
    boxShadow: '0 20px 45px rgba(0,0,0,0.18)'
  };

  const input = {
    width: '100%',
    padding: '1rem',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    outline: 'none',
    fontSize: '.95rem'
  };

  const label = {
    display: 'block',
    marginBottom: '.45rem',
    color: '#e2e8f0',
    fontSize: '.9rem',
    fontWeight: '600'
  };

  const button = {
    border: 'none',
    padding: '1rem 1.2rem',
    borderRadius: '14px',
    background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer'
  };

  return (
    <div style={{ padding: '1rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <h1
            style={{
              color: '#fff',
              fontSize: '2rem',
              fontWeight: '800',
              marginBottom: '.35rem'
            }}
          >
            Course Editor
          </h1>

          <p style={{ color: '#94a3b8' }}>
            Managing: {course.title}
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/courses')}
          style={{
            ...button,
            background: 'rgba(255,255,255,0.08)'
          }}
        >
          ← Back
        </button>
      </div>

      {/* Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(360px,1fr))',
          gap: '1.5rem'
        }}
      >
        {/* Course Details Section */}
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={card}>
            <h3 style={{ color: '#fff', marginBottom: '1.5rem' }}>Course Details</h3>
            <form onSubmit={handleUpdateMetadata} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '100%',
                  height: '180px',
                  borderRadius: '18px',
                  border: '1px solid var(--glass-border)',
                  overflow: 'hidden',
                  background: 'rgba(0,0,0,0.2)',
                  position: 'relative'
                }}>
                  {preview ? (
                    <img src={preview} alt="Course Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ color: 'var(--text-muted)', paddingTop: '60px' }}>No Thumbnail</div>
                  )}
                  <label htmlFor="edit-thumbnail" style={{ position: 'absolute', inset: 0, cursor: 'pointer' }}>
                    <input type="file" id="edit-thumbnail" hidden onChange={handleFileChange} accept="image/*" />
                  </label>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Click to change thumbnail</p>
              </div>

              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={label}>Course Title</label>
                  <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={input} required />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={label}>Course Description</label>
                  <textarea value={editDescription} onChange={(e) => setEditDescription(e.target.value)} style={{ ...input, minHeight: '100px', resize: 'vertical' }} />
                </div>
                <button type="submit" disabled={loading} style={{ ...button, width: '100%' }}>
                  {loading ? 'Saving...' : 'Update Course Details'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modules Section */}
        <div>
          <div style={card}>
            <h3 style={{ color: '#fff', marginBottom: '1rem' }}>
              Add Module
            </h3>

            <form
              onSubmit={handleCreateModule}
              style={{
                display: 'flex',
                gap: '.7rem',
                flexWrap: 'wrap'
              }}
            >
              <input
                type="text"
                value={moduleTitle}
                onChange={(e) =>
                  setModuleTitle(e.target.value)
                }
                placeholder="Module Title"
                required
                style={{
                  ...input,
                  flex: 1,
                  minWidth: '220px'
                }}
              />

              <button type="submit" style={button}>
                Add
              </button>
            </form>
          </div>

          {/* Modules List */}
          <div style={{ marginTop: '1rem' }}>
            {course.modules?.map((m) => (
              <div
                key={m.id}
                style={{
                  ...card,
                  marginBottom: '1rem',
                  border:
                    activeModule === m.id
                      ? '1px solid #3b82f6'
                      : '1px solid rgba(255,255,255,0.08)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}
                >
                  <h4
                    style={{
                      color: '#fff',
                      fontSize: '1.05rem'
                    }}
                  >
                    {m.title}
                  </h4>

                  <button
                    onClick={() => setActiveModule(m.id)}
                    style={{
                      ...button,
                      padding: '.65rem 1rem',
                      background:
                        activeModule === m.id
                          ? 'linear-gradient(135deg,#3b82f6,#8b5cf6)'
                          : 'rgba(255,255,255,0.08)'
                    }}
                  >
                    {activeModule === m.id
                      ? 'Selected'
                      : 'Select'}
                  </button>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  {m.lessons?.length === 0 ? (
                    <p style={{ color: '#94a3b8' }}>
                      No lessons added.
                    </p>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '.6rem'
                      }}
                    >
                      {m.lessons.map((l) => (
                        <div
                          key={l.id}
                          style={{
                            padding: '.75rem',
                            borderRadius: '12px',
                            background:
                              'rgba(255,255,255,0.04)',
                            color: '#cbd5e1'
                          }}
                        >
                          Day {l.day_number}: {l.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lesson Form */}
        <div>
          <div
            style={{
              ...card,
              opacity: activeModule ? 1 : 0.65,
              pointerEvents: activeModule
                ? 'auto'
                : 'none'
            }}
          >
            <h3 style={{ color: '#fff', marginBottom: '.4rem' }}>
              Add Lesson
            </h3>

            <p
              style={{
                color: '#94a3b8',
                marginBottom: '1.3rem'
              }}
            >
              Select a module to begin adding lessons.
            </p>

            <form onSubmit={handleUploadLesson}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={label}>Day Number</label>
                <input
                  type="number"
                  value={dayNumber}
                  onChange={(e) =>
                    setDayNumber(
                      parseInt(e.target.value)
                    )
                  }
                  style={input}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={label}>Lesson Title</label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={(e) =>
                    setLessonTitle(e.target.value)
                  }
                  style={input}
                  required
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={label}>
                  Bunny Video ID
                </label>
                <input
                  type="text"
                  value={bunnyVideoId}
                  onChange={(e) =>
                    setBunnyVideoId(e.target.value)
                  }
                  style={input}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={label}>
                  Notes URL
                </label>
                <input
                  type="url"
                  value={notesUrl}
                  onChange={(e) =>
                    setNotesUrl(e.target.value)
                  }
                  style={input}
                />
              </div>

              {message && (
                <div
                  style={{
                    marginBottom: '1rem',
                    color: message
                      .toLowerCase()
                      .includes('success')
                      ? '#10b981'
                      : '#f87171',
                    fontWeight: '600'
                  }}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={button}
              >
                {loading
                  ? 'Uploading...'
                  : 'Save Lesson'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
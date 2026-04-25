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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/courses/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem(
              'access_token'
            )}`
          },
          body: JSON.stringify({ title, description })
        }
      );

      if (response.ok) {
        navigate('/admin/courses');
      } else {
        setError('Failed to create course');
      }
    } catch {
      setError('Network error');
    }
  };

  const cardStyle = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '2rem',
    boxShadow: '0 20px 50px rgba(0,0,0,0.18)'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '.55rem',
    color: '#e2e8f0',
    fontSize: '.92rem',
    fontWeight: '600'
  };

  const inputStyle = {
    width: '100%',
    padding: '1rem',
    borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    color: '#fff',
    outline: 'none',
    fontSize: '.95rem'
  };

  return (
    <div
      style={{
        padding: '1rem',
        minHeight: '100vh'
      }}
    >
      <div
        style={{
          maxWidth: '760px',
          margin: '0 auto'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1
            style={{
              color: '#fff',
              fontSize: '2rem',
              fontWeight: '800',
              marginBottom: '.45rem'
            }}
          >
            Create New Course
          </h1>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '.95rem'
            }}
          >
            Build a premium learning experience for your students.
          </p>
        </div>

        {/* Main Card */}
        <div style={cardStyle}>
          <form onSubmit={handleSubmit}>
            {/* Course Title */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Course Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Full Stack Web Development"
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Description</label>

              <textarea
                rows="6"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Write course overview, benefits, outcomes..."
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '160px'
                }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  color: '#f87171',
                  marginBottom: '1rem',
                  fontWeight: '600'
                }}
              >
                {error}
              </div>
            )}

            {/* Buttons */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
                marginTop: '1rem'
              }}
            >
              <button
                type="submit"
                style={{
                  border: 'none',
                  padding: '1rem 1.5rem',
                  borderRadius: '14px',
                  background:
                    'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  minWidth: '180px'
                }}
              >
                Create Course
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  border: 'none',
                  padding: '1rem 1.5rem',
                  borderRadius: '14px',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  minWidth: '140px'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
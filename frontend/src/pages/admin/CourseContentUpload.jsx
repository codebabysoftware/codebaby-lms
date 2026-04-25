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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/content/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              'access_token'
            )}`
          },
          body: formData
        }
      );

      if (response.ok) {
        navigate('/admin/courses');
      } else {
        const errorData = await response.json();
        setError(JSON.stringify(errorData));
      }
    } catch {
      setError('Network error during upload');
    } finally {
      setUploading(false);
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
            Upload Course Content
          </h1>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '.95rem'
            }}
          >
            Add premium learning materials, videos and notes for students.
          </p>
        </div>

        {/* Main Card */}
        <div style={cardStyle}>
          <form onSubmit={handleUpload}>
            {/* Module Title */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Module Title</label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Introduction to React Basics"
                style={inputStyle}
              />
            </div>

            {/* Upload Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit,minmax(280px,1fr))',
                gap: '1rem',
                marginBottom: '1rem'
              }}
            >
              {/* Video */}
              <div>
                <label style={labelStyle}>Video File</label>

                <div style={uploadBox}>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) =>
                      setVideoFile(e.target.files[0])
                    }
                    style={fileInput}
                  />

                  <span style={uploadText}>
                    {videoFile
                      ? videoFile.name
                      : 'Choose video file'}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>PDF Notes</label>

                <div style={uploadBox}>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setNotesFile(e.target.files[0])
                    }
                    style={fileInput}
                  />

                  <span style={uploadText}>
                    {notesFile
                      ? notesFile.name
                      : 'Choose PDF file'}
                  </span>
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  color: '#f87171',
                  marginTop: '.5rem',
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
                disabled={uploading}
                style={{
                  border: 'none',
                  padding: '1rem 1.4rem',
                  borderRadius: '14px',
                  background:
                    'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                  color: '#fff',
                  fontWeight: '700',
                  cursor: 'pointer',
                  minWidth: '180px'
                }}
              >
                {uploading
                  ? 'Uploading...'
                  : 'Save Content'}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                style={{
                  border: 'none',
                  padding: '1rem 1.4rem',
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

const uploadBox = {
  position: 'relative',
  borderRadius: '14px',
  border: '1px dashed rgba(255,255,255,0.18)',
  background: 'rgba(255,255,255,0.03)',
  padding: '1rem',
  minHeight: '64px',
  display: 'flex',
  alignItems: 'center'
};

const fileInput = {
  position: 'absolute',
  inset: 0,
  opacity: 0,
  cursor: 'pointer',
  width: '100%'
};

const uploadText = {
  color: '#cbd5e1',
  fontSize: '.92rem'
};
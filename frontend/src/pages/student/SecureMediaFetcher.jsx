import { useState, useEffect } from 'react';

export default function SecureMediaFetcher({
  contentId,
  type,
  title
}) {
  const [blobUrl, setBlobUrl] =
    useState(null);
  const [loading, setLoading] =
    useState(false);
  const [error, setError] =
    useState('');

  useEffect(() => {
    let url = null;
    let isActive = true;

    const fetchMedia = async () => {
      setLoading(true);
      setError('');

      try {
        const endpoint =
          type === 'video'
            ? 'download_video'
            : 'download_notes';

        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/lessons/${contentId}/${endpoint}/`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                'access_token'
              )}`
            }
          }
        );

        if (res.ok) {
          const blob =
            await res.blob();

          if (isActive) {
            url =
              URL.createObjectURL(
                blob
              );
            setBlobUrl(url);
          }
        } else {
          setError(
            'Failed to fetch secure media. You might not have access.'
          );
        }
      } catch {
        setError(
          'Network error loading secure media.'
        );
      } finally {
        if (isActive)
          setLoading(false);
      }
    };

    fetchMedia();

    return () => {
      isActive = false;

      if (url)
        URL.revokeObjectURL(url);
    };
  }, [contentId, type]);

  if (loading) {
    return (
      <div
        style={{
          marginTop: '1rem',
          padding: '3rem 2rem',
          borderRadius: '22px',
          background:
            'rgba(255,255,255,0.06)',
          border:
            '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border:
              '3px solid rgba(255,255,255,0.15)',
            borderTop:
              '3px solid #3b82f6',
            margin:
              '0 auto 1rem auto',
            animation:
              'spin 1s linear infinite'
          }}
        />

        <h3
          style={{
            color: '#fff',
            marginBottom: '.45rem'
          }}
        >
          Loading Secure Media
        </h3>

        <p
          style={{
            color: '#94a3b8',
            fontSize: '.92rem'
          }}
        >
          Preparing protected
          content...
        </p>

        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          marginTop: '1rem',
          padding: '1.2rem',
          borderRadius: '18px',
          background:
            'rgba(239,68,68,0.08)',
          border:
            '1px solid rgba(239,68,68,0.25)',
          color: '#fca5a5',
          fontWeight: '600'
        }}
      >
        {error}
      </div>
    );
  }

  if (!blobUrl) return null;

  return (
    <div
      style={{
        marginTop: '1rem',
        borderRadius: '22px',
        overflow: 'hidden',
        background: '#000',
        border:
          '1px solid rgba(255,255,255,0.08)',
        boxShadow:
          '0 25px 50px rgba(0,0,0,0.25)'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding:
            '.95rem 1.2rem',
          background:
            'linear-gradient(135deg,#111827,#1e293b)',
          borderBottom:
            '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          justifyContent:
            'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <h3
            style={{
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '700',
              marginBottom:
                '.2rem'
            }}
          >
            {title ||
              'Protected Content'}
          </h3>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '.82rem'
            }}
          >
            Secure streaming
            mode enabled
          </p>
        </div>

        <span
          style={{
            padding:
              '.35rem .65rem',
            borderRadius:
              '999px',
            background:
              'rgba(59,130,246,0.15)',
            color: '#60a5fa',
            fontSize: '.78rem',
            fontWeight: '700'
          }}
        >
          {type === 'video'
            ? 'VIDEO'
            : 'NOTES'}
        </span>
      </div>

      {/* Media */}
      <div
        onContextMenu={(e) =>
          e.preventDefault()
        }
        style={{
          position: 'relative',
          width: '100%'
        }}
      >
        {type === 'video' ? (
          <video
            src={blobUrl}
            controls
            controlsList="nodownload"
            disablePictureInPicture
            style={{
              width: '100%',
              maxHeight: '720px',
              display: 'block',
              background:
                '#000'
            }}
          />
        ) : (
          <iframe
            src={`${blobUrl}#toolbar=0`}
            title={title}
            style={{
              width: '100%',
              height: '720px',
              border: 'none',
              background:
                '#111827'
            }}
          />
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';

export default function SecureMediaFetcher({ contentId, type, title }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let url = null;
    let isActive = true;

    const fetchMedia = async () => {
      setLoading(true);
      try {
        const endpoint = type === 'video' ? 'download_video' : 'download_notes';
        const res = await fetch(`http://localhost:8000/api/lessons/${contentId}/${endpoint}/`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        });
        
        if (res.ok) {
          const blob = await res.blob();
          if (isActive) {
            url = URL.createObjectURL(blob);
            setBlobUrl(url);
          }
        } else {
          setError('Failed to fetch secure media. You might not have access.');
        }
      } catch (err) {
        setError('Network error loading secure media.');
      } finally {
        if (isActive) setLoading(false);
      }
    };

    fetchMedia();

    return () => {
      isActive = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [contentId, type]);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Secure Media...</div>;
  if (error) return <div className="error-text" style={{ padding: '1rem' }}>{error}</div>;
  if (!blobUrl) return null;

  return (
    <div style={{ marginTop: '1rem', background: '#000', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
      {/* 
        Attempt to create a transparent overlay to deter right clicks directly on the player, 
        although controls controlsList="nodownload" disables standard download buttons.
      */}
      <div 
        onContextMenu={(e) => e.preventDefault()} 
        style={{ width: '100%', height: '100%', position: 'relative' }}
      >
        {type === 'video' ? (
           <video 
             src={blobUrl} 
             controls 
             controlsList="nodownload" 
             disablePictureInPicture
             style={{ width: '100%', maxHeight: '600px', display: 'block' }}
           />
        ) : (
           <iframe 
             src={`${blobUrl}#toolbar=0`} 
             style={{ width: '100%', height: '600px', border: 'none' }}
             title={title}
           />
        )}
      </div>
    </div>
  );
}

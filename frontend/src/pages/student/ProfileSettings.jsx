import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function ProfileSettings() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [file, setFile] = useState(null);

  const getInitialPreview = () => {
    if (!user?.profile_pic_url) return null;
    if (user.profile_pic_url.startsWith('http') || user.profile_pic_url.startsWith('data:')) return user.profile_pic_url;
    return `${import.meta.env.VITE_API_URL}${user.profile_pic_url}`;
  };

  const [preview, setPreview] = useState(getInitialPreview());

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      if (file) {
        data.append('profile_pic', file);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/student/profile/update/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: data
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: 'Failed to update profile: ' + JSON.stringify(errorData) });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    borderRadius: '12px',
    border: '1px solid var(--glass-border)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    marginTop: '0.5rem',
    outline: 'none',
    transition: 'border 0.2s ease'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', animation: 'slideUpFadeIn 0.5s ease-out' }}>
      <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: '800', marginBottom: '2rem', fontFamily: 'var(--font-display)' }}>
        Profile Settings
      </h2>

      <div className="premium-glass" style={{ padding: '2.5rem', borderRadius: '32px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '30px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #111, #222)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--glass-border)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
              }}>
                {preview ? (
                  <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '3rem', color: '#fff', fontWeight: '800' }}>
                    {user?.first_name ? user.first_name[0].toUpperCase() : user?.username?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <label htmlFor="profile_pic" style={{
                position: 'absolute',
                bottom: '-10px',
                right: '-10px',
                background: 'var(--accent-secondary)',
                color: '#fff',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                fontSize: '1.2rem'
              }}>
                📷
                <input type="file" id="profile_pic" hidden onChange={handleFileChange} accept="image/*" />
              </label>
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '0.4rem', fontWeight: '700' }}>Profile Identity</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Your photo will be visible across the learning portal. <br/>
                Professional avatars enhance your peer presence.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>First Name</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Last Name</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Phone Number</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          {message.text && (
            <div style={{
              padding: '1.2rem',
              borderRadius: '16px',
              marginBottom: '2rem',
              background: message.type === 'success' ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
              color: message.type === 'success' ? '#10b981' : '#ef4444',
              border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
              fontWeight: '600',
              textAlign: 'center'
            }}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-premium"
            style={{ width: '100%', justifyContent: 'center', padding: '1.2rem' }}
          >
            {loading ? 'Processing...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}

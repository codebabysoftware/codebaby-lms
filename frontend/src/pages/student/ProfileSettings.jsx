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
        
        // Give the user a moment to see the success message before reloading
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

  const glass = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '22px',
    padding: '2rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)',
    background: 'rgba(255,255,255,0.05)',
    color: '#fff',
    marginTop: '0.5rem',
    outline: 'none'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' }}>
        Profile Settings
      </h2>

      <div style={glass}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                overflow: 'hidden',
                background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid rgba(255,255,255,0.1)'
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
                bottom: '0',
                right: '0',
                background: '#3b82f6',
                color: '#fff',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}>
                📷
                <input type="file" id="profile_pic" hidden onChange={handleFileChange} accept="image/*" />
              </label>
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ color: '#fff', marginBottom: '0.5rem' }}>Profile Picture</h4>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                Upload a professional photo. PNG, JPG or GIF. Max 2MB.
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>First Name</label>
              <input 
                type="text" 
                name="first_name" 
                value={formData.first_name} 
                onChange={handleChange} 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Last Name</label>
              <input 
                type="text" 
                name="last_name" 
                value={formData.last_name} 
                onChange={handleChange} 
                style={inputStyle} 
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Phone Number</label>
            <input 
              type="text" 
              name="phone" 
              value={formData.phone} 
              onChange={handleChange} 
              style={inputStyle} 
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>Address</label>
            <textarea 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <label style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>City</label>
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                style={inputStyle} 
              />
            </div>
            <div>
              <label style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>State</label>
              <input 
                type="text" 
                name="state" 
                value={formData.state} 
                onChange={handleChange} 
                style={inputStyle} 
              />
            </div>
          </div>

          {message.text && (
            <div style={{
              padding: '1rem',
              borderRadius: '12px',
              marginBottom: '1.5rem',
              background: message.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              color: message.type === 'success' ? '#10b981' : '#ef4444',
              border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`
            }}>
              {message.text}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
              color: '#fff',
              fontWeight: '700',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: '0.3s ease'
            }}
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>

  );
}

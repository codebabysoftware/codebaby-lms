import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);

    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        minHeight: '100vh',
        display: 'flex',
        background:
          'linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e293b 100%)',
      }}
    >
      {/* Left Section */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '3rem',
          color: '#fff',
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          {/* Center Big Logo */}
          <div
            style={{
              width: '240px',
              height: '240px',
              margin: '0 auto 2rem auto',
              borderRadius: '32px',
              background: '#ffffff',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.30)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src="logo.png"
              alt="CodeBaby Logo"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                padding: '12px',
              }}
            />
          </div>

          <h1
            style={{
              fontSize: '3rem',
              fontWeight: '800',
              marginBottom: '1rem',
              lineHeight: '1.1',
            }}
          >
            CodeBaby Software
          </h1>

          <p
            style={{
              fontSize: '1.3rem',
              color: '#cbd5e1',
              marginBottom: '1.5rem',
              letterSpacing: '1px',
            }}
          >
            Learn • Build • Grow
          </p>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '1rem',
              lineHeight: '1.8',
            }}
          >
            Learn Skills Companies Hire For
            Job-ready learning programs for students, freshers, professionals and career switchers.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <div
          className="glass-panel"
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '2.5rem',
            borderRadius: '24px',
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          }}
        >
          <h2
            style={{
              marginBottom: '0.5rem',
              textAlign: 'center',
              color: '#fff',
              fontSize: '2rem',
              fontWeight: '700',
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              textAlign: 'center',
              color: '#cbd5e1',
              marginBottom: '2rem',
              fontSize: '0.95rem',
            }}
          >
            Sign in to continue your journey
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#e2e8f0',
                }}
              >
                Username
              </label>

              <input
                type="text"
                className="input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  color: '#e2e8f0',
                }}
              >
                Password
              </label>

              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#fff',
                }}
              />
            </div>

            {error && (
              <div
                className="error-text"
                style={{
                  marginBottom: '1rem',
                  color: '#fca5a5',
                  fontSize: '0.9rem',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              style={{
                width: '100%',
                padding: '0.95rem',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '700',
                fontSize: '1rem',
                cursor: 'pointer',
                background:
                  'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: '#fff',
                marginTop: '0.5rem',
              }}
            >
              Sign In
            </button>

            {/* Help Section */}
            <div
              style={{
                marginTop: '1.25rem',
                textAlign: 'center',
                fontSize: '0.9rem',
                color: '#cbd5e1',
              }}
            >
              Having issue to login?{' '}
              <a
                href="https://forms.gle/yvXkRNwotiAD2HeY9"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#60a5fa',
                  textDecoration: 'none',
                  fontWeight: '600',
                }}
              >
                Contact Admin
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
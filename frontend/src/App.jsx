import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import {
  useContext
} from 'react';

import {
  AuthContext,
  AuthProvider
} from './context/AuthContext';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';

const FullScreenLoader = ({
  text = 'Loading...'
}) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        background:
          'linear-gradient(135deg,#0f172a 0%,#111827 45%,#1e293b 100%)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          textAlign: 'center',
          padding: '2.5rem',
          borderRadius: '26px',
          background:
            'rgba(255,255,255,0.08)',
          backdropFilter:
            'blur(18px)',
          border:
            '1px solid rgba(255,255,255,0.08)',
          boxShadow:
            '0 25px 50px rgba(0,0,0,0.25)'
        }}
      >
        {/* Spinner */}
        <div
          style={{
            width: '58px',
            height: '58px',
            margin:
              '0 auto 1.2rem auto',
            borderRadius: '50%',
            border:
              '4px solid rgba(255,255,255,0.12)',
            borderTop:
              '4px solid #3b82f6',
            animation:
              'spin 1s linear infinite'
          }}
        />

        <h2
          style={{
            color: '#fff',
            fontSize: '1.3rem',
            fontWeight: '800',
            marginBottom: '.45rem'
          }}
        >
          CodeBaby Software
        </h2>

        <p
          style={{
            color: '#94a3b8',
            fontSize: '.95rem'
          }}
        >
          {text}
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
    </div>
  );
};

const ProtectedRoute = ({
  children,
  allowedRole
}) => {
  const { user, loading } =
    useContext(AuthContext);

  if (loading) {
    return (
      <FullScreenLoader text="Checking secure access..." />
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    allowedRole &&
    user.role !==
    allowedRole
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return children;
};

const RootRedirect = () => {
  const { user, loading } =
    useContext(AuthContext);

  if (loading) {
    return (
      <FullScreenLoader text="Preparing your workspace..." />
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    user.role ===
    'ADMIN'
  ) {
    return (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  if (
    user.role ===
    'STUDENT'
  ) {
    return (
      <Navigate
        to="/student"
        replace
      />
    );
  }

  return (
    <Navigate
      to="/login"
      replace
    />
  );
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/"
        element={
          <RootRedirect />
        }
      />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRole="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRole="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
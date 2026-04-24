import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import AdminHome from './admin/AdminHome';
import CourseList from './admin/CourseList';
import CourseCreate from './admin/CourseCreate';
import CourseEditor from './admin/CourseEditor';
import AccessManager from './admin/AccessManager';
import StudentManager from './admin/StudentManager';

export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <div className="sidebar glass-panel">
        <h3 style={{ marginBottom: '2rem' }}>CodeBaby Admin</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Link to="/admin" style={{ color: 'var(--text-secondary)' }}>Dashboard</Link>
          <Link to="/admin/students" style={{ color: 'var(--accent-color)' }}>Manage Students</Link>
          <Link to="/admin/courses" style={{ color: 'var(--accent-color)' }}>Courses</Link>
          <Link to="/admin/access" style={{ color: 'var(--text-secondary)' }}>Access Manager</Link>
        </nav>
        <button onClick={handleLogout} className="btn-primary" style={{ marginTop: 'auto', position: 'absolute', bottom: '2rem', width: 'calc(100% - 2rem)' }}>
          Log Out
        </button>
      </div>
      <div className="main-content">
        <h1>Welcome back, Admin!</h1>
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/students" element={<StudentManager />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/create" element={<CourseCreate />} />
          <Route path="/courses/:courseId/edit" element={<CourseEditor />} />
          <Route path="/access" element={<AccessManager />} />
        </Routes>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  // const navigate = useNavigate();
  // const handleLogout = () => {
  //   localStorage.removeItem('token');
  //   navigate('/login');
  // };
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Modern Sidebar */}
      <div
        style={{
          minWidth: 240,
          background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '2rem 1rem',
          boxShadow: '2px 0 20px rgba(102,126,234,0.08)',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div className="mb-5 text-center">
          <div style={{
            width: 60,
            height: 60,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '2rem',
            color: '#fff',
            boxShadow: '0 4px 16px rgba(102,126,234,0.10)'
          }}>
            👑
          </div>
          <h4 className="fw-bold mb-0" style={{ letterSpacing: 1 }}>Admin Panel</h4>
        </div>
        <ul className="nav flex-column w-100 mb-4" style={{ gap: '0.5rem' }}>
          <li className="nav-item mb-2">
            <Link
              className="nav-link d-flex align-items-center px-3 py-2 rounded fw-semibold"
              to="/admin/dashboard"
              style={{ color: '#fff', transition: 'background 0.2s' }}
              onMouseOver={e => (e.target.style.background = 'rgba(255,255,255,0.08)')}
              onMouseOut={e => (e.target.style.background = 'transparent')}
            >
              <span className="me-2" style={{ fontSize: '1.2rem' }}>🏠</span> Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link
              className="nav-link d-flex align-items-center px-3 py-2 rounded fw-semibold"
              to="/admin/complaints"
              style={{ color: '#fff', transition: 'background 0.2s' }}
              onMouseOver={e => (e.target.style.background = 'rgba(255,255,255,0.08)')}
              onMouseOut={e => (e.target.style.background = 'transparent')}
            >
              <span className="me-2" style={{ fontSize: '1.2rem' }}>📋</span> Complaints
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex-grow-1 bg-light p-0" style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout; 
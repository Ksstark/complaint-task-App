import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const TrackComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('http://localhost:5000/complaints');
        // Filter to only show complaints by the logged-in user
        const payload = JSON.parse(atob(localStorage.getItem('token').split('.')[1]));
        setComplaints(res.data.filter(c => c.user._id === payload.id));
      } catch (err) {
        setError('Failed to load complaints');
      }
      setLoading(false);
    };
    fetchComplaints();
  }, []);

  // Get unique departments for filter dropdown
  const departments = Array.from(new Set(complaints.map(c => c.department)));
  const statusOptions = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

  const filtered = complaints.filter(c =>
    (!filterStatus || c.status === filterStatus) &&
    (!filterDept || c.department === filterDept) &&
    (!filterPriority || c.priority === filterPriority)
  );

  // Sort filtered complaints by date descending (most recent first)
  const filteredSorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return { bg: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', icon: '⏳' };
      case 'In Progress': return { bg: 'rgba(13, 110, 253, 0.1)', color: '#0d6efd', icon: '🔄' };
      case 'Resolved': return { bg: 'rgba(25, 135, 84, 0.1)', color: '#198754', icon: '✅' };
      case 'Rejected': return { bg: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', icon: '❌' };
      default: return { bg: 'rgba(108, 117, 125, 0.1)', color: '#6c757d', icon: '❓' };
    }
  };

  // Priority color helper
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return { bg: 'rgba(25, 135, 84, 0.1)', color: '#198754', icon: '🟢' };
      case 'medium': return { bg: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', icon: '🟡' };
      case 'high': return { bg: 'rgba(253, 126, 20, 0.1)', color: '#fd7e14', icon: '🟠' };
      case 'urgent': return { bg: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', icon: '🔴' };
      default: return { bg: 'rgba(108, 117, 125, 0.1)', color: '#6c757d', icon: '⚪' };
    }
  };

  // Helper functions for Indian date and time format
  const formatDateIndian = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.toLocaleString('en-IN', { day: '2-digit', timeZone: 'Asia/Kolkata' });
    const month = date.toLocaleString('en-IN', { month: 'short', timeZone: 'Asia/Kolkata' });
    const year = date.toLocaleString('en-IN', { year: 'numeric', timeZone: 'Asia/Kolkata' });
    return `${day}/${month}/${year}`;
  };
  const formatTimeIndian = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem 0'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s ease-in-out infinite',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '100px',
        height: '100px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        animation: 'pulse 3s ease-in-out infinite',
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '15%',
        width: '150px',
        height: '150px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        zIndex: 1
      }}></div>

      <div className="container-fluid" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row justify-content-center">
          <div className="col-xl-10">
            {/* Header Section */}
            <div className="d-flex align-items-center mb-4">
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '1.5rem',
                fontSize: '2rem',
                color: '#fff',
                boxShadow: '0 4px 16px rgba(102,126,234,0.10)'
              }}>
                📋
              </div>
              <div>
                <h2 className="fw-bold mb-1" style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>Track My Complaints</h2>
                <p className="mb-0" style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>Monitor the status and progress of your complaints</p>
              </div>
            </div>

            {/* Filters Section */}
            <div className="row mb-4 g-3">
              <div className="col-md-3">
                <select className="form-select form-select-lg" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ borderRadius: '15px', borderColor: '#e9ecef' }}>
                  <option value="">All Statuses</option>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select form-select-lg" value={filterDept} onChange={e => setFilterDept(e.target.value)} style={{ borderRadius: '15px', borderColor: '#e9ecef' }}>
                  <option value="">All Departments</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <select className="form-select form-select-lg" value={filterPriority} onChange={e => setFilterPriority(e.target.value)} style={{ borderRadius: '15px', borderColor: '#e9ecef' }}>
                  <option value="">All Priorities</option>
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="col-md-3">
                <button
                  className="btn w-100 py-3 fw-semibold"
                  style={{
                    borderRadius: '15px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    transition: 'background 0.2s, color 0.2s'
                  }}
                  onClick={() => { setFilterStatus(''); setFilterDept(''); setFilterPriority(''); }}
                  onMouseOver={e => {
                    e.target.style.background = 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)';
                    e.target.style.color = '#fff';
                  }}
                  onMouseOut={e => {
                    e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    e.target.style.color = '#fff';
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>Reset
                </button>
              </div>
            </div>

            {/* Complaints List Section */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '25px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading your complaints...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger border-0" style={{
                  background: 'rgba(220, 53, 69, 0.1)',
                  color: '#dc3545',
                  borderRadius: '15px',
                  border: '1px solid rgba(220, 53, 69, 0.2)'
                }}>
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'rgba(108, 117, 125, 0.1)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                    fontSize: '2rem'
                  }}>
                    📭
                  </div>
                  <h5 className="text-muted">No complaints found</h5>
                  <p className="text-muted">Try adjusting your filters or file a new complaint</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0" style={{ borderRadius: '15px', overflow: 'hidden', background: 'white' }}>
                    <thead className="table-light">
                      <tr>
                        <th>Sr No</th>
                        <th>Status</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Department</th>
                        <th>Priority</th>
                        <th>Date</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSorted.map((c, idx) => {
                        const statusStyle = getStatusColor(c.status);
                        const priorityStyle = getPriorityColor(c.priority);
                        return (
                          <tr key={c._id}>
                            <td>{idx + 1}</td>
                            <td style={{ color: statusStyle.color, fontWeight: 600 }}>
                              <span style={{ marginRight: 6 }}>{statusStyle.icon}</span>{c.status}
                            </td>
                            <td style={{ wordBreak: 'break-word' }}>{c.title}</td>
                            <td style={{ wordBreak: 'break-word', whiteSpace: 'pre-line', maxWidth: 350, height: 100, overflowY: 'auto', display: 'block' }}>{c.description}</td>
                            <td>{c.department}</td>
                            <td>
                              <span style={{
                                background: priorityStyle.bg,
                                color: priorityStyle.color,
                                padding: '0.3rem 0.6rem',
                                borderRadius: '15px',
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                border: `1px solid ${priorityStyle.color}`,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.2em',
                                textTransform: 'capitalize'
                              }}>
                                {priorityStyle.icon} {c.priority}
                              </span>
                            </td>
                            <td>{formatDateIndian(c.date)}</td>
                            <td>{formatTimeIndian(c.date)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="text-center mt-4">
              <Link to="/user/dashboard" className="btn btn-outline-light px-4 py-2" style={{ borderRadius: '25px', fontWeight: 600, letterSpacing: 1 }}>
                &larr; Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.1); opacity: 0.3; }
        }
        .form-select:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
        }
      `}</style>
    </div>
  );
};

export default TrackComplaints; 
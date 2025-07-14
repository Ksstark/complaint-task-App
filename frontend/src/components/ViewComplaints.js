import React, { useEffect, useState } from 'react';
import api from '../api';
import AdminLayout from './AdminLayout';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNotification } from './NotificationContext';

const statusOptions = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  // Modal state for full description
  const [showModal, setShowModal] = useState(false);
  const [modalDescription, setModalDescription] = useState('');
  // Notification state for high priority complaints
  const { highPriorityComplaints, loading: notificationLoading, fetchHighPriorityComplaints, removeComplaintById } = useNotification();
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const handleShowModal = (desc) => {
    setModalDescription(desc);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('http://localhost:5000/complaints');
      setComplaints(res.data);
    } catch (err) {
      setError('Failed to load complaints');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`http://localhost:5000/complaints/${id}`, { status });
      // Find the updated complaint
      const updatedComplaint = complaints.find(c => c._id === id);
      // If it is high/urgent and status is now not Pending/In Progress, update notification state
      if ((updatedComplaint?.priority === 'high' || updatedComplaint?.priority === 'urgent') && (status === 'Resolved' || status === 'Rejected')) {
        removeComplaintById(id);
      }
      fetchComplaints();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('Delete this complaint?')) return;
    try {
      await api.delete(`http://localhost:5000/complaints/${id}`);
      fetchComplaints();
    } catch (err) {
      alert('Failed to delete complaint');
    }
  };

  // Filter and search
  const filtered = complaints.filter(c =>
    (!search || c.title.toLowerCase().includes(search.toLowerCase()) || c.description.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStatus || c.status === filterStatus) &&
    (!filterDept || c.department === filterDept) &&
    (!filterPriority || c.priority === filterPriority)
  );

  // Get unique departments for filter dropdown
  const departments = Array.from(new Set(complaints.map(c => c.department)));

  // Status color helper
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
  function formatDateIndian(dateStr) {
    var date = new Date(dateStr);
    var day = String(date.getDate()).padStart(2, '0');
    var month = date.toLocaleString('en-US', { month: 'short' });
    var year = date.getFullYear();
    return day + '/' + month + '/' + year;
  }
  function formatTimeIndian(dateStr) {
    var date = new Date(dateStr);
    var hours = date.getHours();
    var minutes = String(date.getMinutes()).padStart(2, '0');
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return hours + ':' + minutes + ' ' + ampm;
  }

  return (
    <AdminLayout>
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
            <div className="col-xl-11">
              {/* Header Section */}
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div className="d-flex align-items-center">
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
                    <h2 className="fw-bold mb-1" style={{ color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.18)' }}>Complaint Management</h2>
                    <p className="mb-0" style={{ color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 4px rgba(0,0,0,0.12)' }}>View, filter, and manage all complaints</p>
                  </div>
                </div>
                
                {/* Notification Button */}
                <button
                  onClick={() => {
                    fetchHighPriorityComplaints();
                    setShowNotificationModal(true);
                  }}
                  disabled={notificationLoading}
                  style={{
                    background: 'rgba(220, 53, 69, 0.15)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    boxShadow: '0 4px 12px rgba(220,53,69,0.15)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  onMouseOver={e => {
                    e.target.style.background = 'rgba(220, 53, 69, 0.25)';
                    e.target.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={e => {
                    e.target.style.background = 'rgba(220, 53, 69, 0.15)';
                    e.target.style.transform = 'scale(1)';
                  }}
                >
                  {notificationLoading ? (
                    <div className="spinner-border spinner-border-sm text-white" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <>
                      🔔
                      {highPriorityComplaints.length > 0 && (
                        <div style={{
                          position: 'absolute',
                          top: '-5px',
                          right: '-5px',
                          background: '#dc3545',
                          color: 'white',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '2px solid #fff'
                        }}>
                          {highPriorityComplaints.length}
                        </div>
                      )}
                    </>
                  )}
                </button>
              </div>

              {/* Filters Section */}
              <div className="row mb-4 g-3">
                <div className="col-md-3">
                  <input className="form-control form-control-lg" placeholder="Search by title" value={search} onChange={e => setSearch(e.target.value)} style={{ borderRadius: '15px', borderColor: '#e9ecef' }} />
                </div>
                <div className="col-md-2">
                  <select className="form-select form-select-lg" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ borderRadius: '15px', borderColor: '#e9ecef' }}>
                    <option value="">All Statuses</option>
                    {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
                  <select className="form-select form-select-lg" value={filterDept} onChange={e => setFilterDept(e.target.value)} style={{ borderRadius: '15px', borderColor: '#e9ecef' }}>
                    <option value="">All Departments</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-md-2">
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
                    onClick={() => { setSearch(''); setFilterStatus(''); setFilterDept(''); setFilterPriority(''); }}
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

              {/* Complaints Table Section */}
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
                    <p className="mt-3 text-muted">Loading complaints...</p>
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
                    <p className="text-muted">Try adjusting your filters or check back later</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table mt-4 align-middle" style={{ borderRadius: '15px', overflow: 'hidden', background: 'rgba(255,255,255,0.85)', boxShadow: '0 4px 24px rgba(102,126,234,0.08)' }}>
                      <thead>
                        <tr style={{
                          background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                          color: '#fff',
                          border: 'none',
                          fontWeight: 600,
                          letterSpacing: 1
                        }}>
                          <th>Sr No</th>
                          <th>Title</th>
                          <th>Description</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>User</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...filtered].sort((a, b) => new Date(b.date) - new Date(a.date)).map((c, idx) => {
                          const statusStyle = getStatusColor(c.status);
                          const priorityStyle = getPriorityColor(c.priority);
                          return (
                            <tr key={c._id} style={{
                              background: 'rgba(255,255,255,0.7)',
                              transition: 'background 0.2s',
                              borderBottom: '1px solid #e9ecef'
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(102,126,234,0.08)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.7)'}
                            >
                              <td>{idx + 1}</td>
                              <td style={{ minWidth: 100 }}>{c.title}</td>
                              <td>
                                <button className="btn btn-sm me-2" style={{ border: '2px solid #0d6efd', color: '#0d6efd', background: 'transparent', borderRadius: '8px', height: '32px', padding: '2px 18px', verticalAlign: 'middle', display: 'inline-block' }} onClick={() => handleShowModal(c.description)}>
                                  View
                                </button>
                              </td>
                              <td>
                                <span style={{
                                  background: priorityStyle.bg,
                                  color: priorityStyle.color,
                                  padding: '0.4rem 0.8rem',
                                  borderRadius: '20px',
                                  fontWeight: 600,
                                  fontSize: '0.9rem',
                                  border: `1px solid ${priorityStyle.color}`,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3em',
                                  textTransform: 'capitalize'
                                }}>
                                  {c.priority}
                                </span>
                              </td>
                              <td>
                                <span style={{
                                  background: c.status === 'In Progress' ? 'rgba(13, 110, 253, 0.15)' : statusStyle.bg,
                                  color: c.status === 'In Progress' ? '#0d6efd' : statusStyle.color,
                                  padding: '0.4rem 0.8rem',
                                  borderRadius: '20px',
                                  fontWeight: 400,
                                  fontSize: '0.95rem',
                                  border: `1px solid ${c.status === 'In Progress' ? '#0d6efd' : statusStyle.color}`,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.4em'
                                }}>
                                  {c.status}
                                </span>
                              </td>
                              <td>{c.user?.username || c.user?.email || c.user}</td>
                              <td>{formatDateIndian(c.date)} {formatTimeIndian(c.date)}</td>
                              <td>
                                <select className="form-select form-select-sm d-inline-block w-auto align-middle me-3 mb-2" value={c.status} onChange={e => handleStatusChange(c._id, e.target.value)} style={{ borderRadius: '8px', borderColor: '#e9ecef', minWidth: 95, height: '32px', padding: '2px 8px', verticalAlign: 'middle' }}>
                                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                                <button className="btn btn-sm fw-semibold align-middle" style={{ borderRadius: '8px', height: '32px', padding: '2px 18px', verticalAlign: 'middle', display: 'inline-block', border: '2px solid #dc3545', color: '#dc3545', background: 'transparent' }} onClick={() => handleDelete(c._id)}>
                                  <i className="bi bi-trash me-1"></i>Delete
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* High Priority Complaints Modal */}
        <Modal 
          show={showNotificationModal} 
          onHide={() => setShowNotificationModal(false)} 
          size="lg"
          centered
        >
          <Modal.Header closeButton style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
            <Modal.Title>
              <div className="d-flex align-items-center">
                <span style={{ fontSize: '1.5rem', marginRight: '10px' }}>🔔</span>
                High Priority Complaints ({highPriorityComplaints.length})
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {highPriorityComplaints.length === 0 ? (
              <div className="text-center py-4">
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'rgba(25, 135, 84, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  fontSize: '2rem'
                }}>
                  ✅
                </div>
                <h5 className="text-success">No High Priority Complaints</h5>
                <p className="text-muted">All complaints are being handled efficiently!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {highPriorityComplaints.map((complaint, index) => {
                  const priorityStyle = getPriorityColor(complaint.priority);
                  const statusStyle = getStatusColor(complaint.status);
                  
                  return (
                    <div key={complaint._id} style={{
                      background: 'rgba(248, 249, 250, 0.8)',
                      borderRadius: '15px',
                      padding: '1.5rem',
                      border: `2px solid ${priorityStyle.color}`,
                      marginBottom: '1rem'
                    }}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="d-flex align-items-center">
                          <span style={{
                            background: priorityStyle.bg,
                            color: priorityStyle.color,
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            border: `1px solid ${priorityStyle.color}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3em',
                            textTransform: 'capitalize',
                            marginRight: '1rem'
                          }}>
                            {priorityStyle.icon} {complaint.priority}
                          </span>
                          <span style={{
                            background: statusStyle.bg,
                            color: statusStyle.color,
                            padding: '0.4rem 0.8rem',
                            borderRadius: '20px',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            border: `1px solid ${statusStyle.color}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3em'
                          }}>
                            {statusStyle.icon} {complaint.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                          {formatDateIndian(complaint.date)} {formatTimeIndian(complaint.date)}
                        </div>
                      </div>
                      
                      <h6 className="fw-bold text-dark mb-2">{complaint.title}</h6>
                      <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        <strong>Department:</strong> {complaint.department}
                      </p>
                      <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                        <strong>User:</strong> {complaint.user?.username || complaint.user?.email || 'Unknown'}
                      </p>
                      <div style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '10px',
                        padding: '1rem',
                        border: '1px solid #e9ecef'
                      }}>
                        <strong>Description:</strong>
                        <p className="mb-0 mt-1" style={{ whiteSpace: 'pre-line', fontSize: '0.9rem' }}>
                          {complaint.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="secondary" 
              onClick={() => setShowNotificationModal(false)}
              style={{ borderRadius: '10px' }}
            >
              Close
            </Button>
            <Button 
              variant="primary" 
              onClick={() => {
                setShowNotificationModal(false);
                // Stay on the same page since we're already on complaints page
              }}
              style={{ 
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              View All Complaints
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal for full description */}
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Full Description</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ whiteSpace: 'pre-line' }}>
            {/* Show Department at the top */}
            {(() => {
              const complaint = complaints.find(c => c.description === modalDescription);
              if (complaint) {
                return (
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#764ba2' }}>
                    Department: {complaint.department}
                  </div>
                );
              }
              return null;
            })()}
            {modalDescription}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.1; }
            50% { transform: scale(1.1); opacity: 0.3; }
          }
          .form-control:focus, .form-select:focus {
            border-color: #667eea !important;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
          }
        `}</style>
      </div>
    </AdminLayout>
  );
};

export default ViewComplaints; 
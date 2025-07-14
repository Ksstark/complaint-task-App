import React, { useEffect, useState } from 'react';
import api from '../api';
import AdminLayout from './AdminLayout';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNotification } from './NotificationContext';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const navigate = useNavigate();
  const { highPriorityComplaints, loading: notificationLoading, fetchHighPriorityComplaints } = useNotification();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('http://localhost:5000/admin/reports');
        setStats(res.data);
      } catch (err) {
        setError('Failed to load dashboard stats');
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return { bg: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', icon: '⏳' };
      case 'In Progress': return { bg: 'rgba(13, 110, 253, 0.1)', color: '#0d6efd', icon: '🔄' };
      case 'Resolved': return { bg: 'rgba(25, 135, 84, 0.1)', color: '#198754', icon: '✅' };
      case 'Rejected': return { bg: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', icon: '❌' };
      default: return { bg: 'rgba(108, 117, 125, 0.1)', color: '#6c757d', icon: '❓' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return { bg: 'rgba(25, 135, 84, 0.1)', color: '#198754', icon: '🟢' };
      case 'medium': return { bg: 'rgba(255, 193, 7, 0.1)', color: '#ffc107', icon: '🟡' };
      case 'high': return { bg: 'rgba(253, 126, 20, 0.1)', color: '#fd7e14', icon: '🟠' };
      case 'urgent': return { bg: 'rgba(220, 53, 69, 0.1)', color: '#dc3545', icon: '🔴' };
      default: return { bg: 'rgba(108, 117, 125, 0.1)', color: '#6c757d', icon: '⚪' };
    }
  };

  const formatDateIndian = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.toLocaleString('en-IN', { day: '2-digit', timeZone: 'Asia/Kolkata' });
    const month = date.toLocaleString('en-IN', { month: 'short', timeZone: 'Asia/Kolkata' });
    const year = date.toLocaleString('en-IN', { year: 'numeric', timeZone: 'Asia/Kolkata' });
    return `${day}/${month}/${year}`;
  };

  const formatTimeIndian = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
  };

  return (
    <AdminLayout>
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Top-right Notification and Logout Buttons */}
        <div style={{
          position: 'absolute',
          top: 24,
          right: 32,
          zIndex: 10,
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
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
                {/* Notification Badge */}
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

          {/* Logout Button */}
          <button
            onClick={async () => {
              try {
                // Get user email from token
                const token = localStorage.getItem('token');
                if (token) {
                  const payload = JSON.parse(atob(token.split('.')[1]));
                  const userEmail = payload.username || payload.email;
                  
                  // Call logout endpoint
                  await api.post('http://localhost:5000/auth/logout', { email: userEmail });
                }
              } catch (error) {
                console.log('Logout logging failed:', error);
              }
              
              // Clear token and navigate
              localStorage.removeItem('token');
              navigate('/login');
            }}
            style={{
              background: 'rgba(220, 53, 69, 0.12)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.6rem 1.5rem',
              fontWeight: 600,
              fontSize: '1rem',
              boxShadow: '0 2px 8px rgba(220,53,69,0.08)',
              transition: 'background 0.2s, color 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer'
            }}
            onMouseOver={e => {
              e.target.style.background = 'rgba(220, 53, 69, 0.25)';
              e.target.style.color = '#fff';
            }}
            onMouseOut={e => {
              e.target.style.background = 'rgba(220, 53, 69, 0.12)';
              e.target.style.color = '#fff';
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>🚪</span> Logout
          </button>
        </div>
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

        <div style={{ position: 'relative', zIndex: 2, padding: '2rem' }}>
          {/* Header Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex align-items-center mb-4">
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px',
                  fontSize: '2rem'
                }}>
                  👑
                </div>
                <div>
                  <h1 className="text-white mb-1 fw-bold">Admin Dashboard</h1>
                  <p className="text-white-50 mb-0">Monitor and manage all complaints across the system</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-white" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-white-50">Loading dashboard statistics...</p>
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
          ) : stats ? (
            <>
              {/* Pie Charts Row */}
              <div className="row justify-content-center mb-4">
                {/* Status Pie Chart */}
                <div className="col-lg-6 d-flex flex-column align-items-center">
                  <h4 className="text-white mb-3 fw-bold">Complaint Status Distribution</h4>
                  <div style={{
                    width: 380,
                    height: 380,
                    background: 'linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%)',
                    borderRadius: '50%',
                    boxShadow: '0 8px 32px rgba(102,126,234,0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24,
                    marginBottom: 24
                  }}>
                    <Pie
                      data={{
                        labels: stats.statusCounts.map(s => s._id),
                        datasets: [
                          {
                            data: stats.statusCounts.map(s => s.count),
                            backgroundColor: [
                              'rgba(255, 193, 7, 0.85)', // Pending
                              'rgba(13, 110, 253, 0.85)', // In Progress
                              'rgba(25, 135, 84, 0.85)', // Resolved
                              'rgba(220, 53, 69, 0.85)'  // Rejected
                            ],
                            borderColor: [
                              '#ffc107',
                              '#0d6efd',
                              '#198754',
                              '#dc3545'
                            ],
                            borderWidth: 3,
                            hoverOffset: 16,
                          },
                        ],
                      }}
                      options={{
                        plugins: {
                          legend: {
                            display: true,
                            position: 'bottom',
                            align: 'center',
                            labels: {
                              font: { size: 16, weight: 'bold' },
                              color: '#333',
                              padding: 24
                            }
                          },
                          tooltip: { enabled: true },
                        },
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>

                {/* Department Bar Chart */}
                <div className="col-lg-6 d-flex flex-column align-items-center">
                  <h4 className="text-white mb-3 fw-bold">Complaints by Department</h4>
                  <div style={{
                    width: 380,
                    height: 380,
                    background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(255,193,7,0.10)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 24,
                    marginBottom: 24
                  }}>
                    <Bar
                      data={{
                        labels: stats.departmentCounts.map(d => d._id),
                        datasets: [
                          {
                            label: 'Number of Complaints',
                            data: stats.departmentCounts.map(d => d.count),
                            backgroundColor: [
                              'rgba(102, 126, 234, 0.85)', // Primary
                              'rgba(118, 75, 162, 0.85)',  // Secondary
                              'rgba(255, 193, 7, 0.85)',   // Warning
                              'rgba(13, 110, 253, 0.85)',  // Info
                              'rgba(25, 135, 84, 0.85)',   // Success
                              'rgba(220, 53, 69, 0.85)',   // Danger
                              'rgba(108, 117, 125, 0.85)', // Secondary
                              'rgba(13, 202, 240, 0.85)'   // Info
                            ],
                            borderColor: [
                              '#667eea',
                              '#764ba2',
                              '#ffc107',
                              '#0d6efd',
                              '#198754',
                              '#dc3545',
                              '#6c757d',
                              '#0dcaf0'
                            ],
                            borderWidth: 2,
                            borderRadius: 8,
                            borderSkipped: false,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'top',
                            align: 'center',
                            labels: {
                              font: { size: 14, weight: 'bold' },
                              color: '#333',
                              padding: 16
                            }
                          },
                          tooltip: { 
                            enabled: true,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: '#667eea',
                            borderWidth: 1
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(0,0,0,0.1)',
                              drawBorder: false
                            },
                            ticks: {
                              color: '#333',
                              font: { size: 12, weight: 'bold' },
                              stepSize: 1,
                              callback: function(value) {
                                if (Number.isInteger(value) && value > 0) {
                                  return value;
                                }
                                return '';
                              }
                            }
                          },
                          x: {
                            grid: {
                              display: false
                            },
                            ticks: {
                              color: '#333',
                              font: { size: 12, weight: 'bold' },
                              maxRotation: 45,
                              minRotation: 0
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Dashboard Cards */}
              <div className="row g-4">

                {/* Most Active Users */}
                <div className="col-lg-6">
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    height: '100%'
                  }}>
                    <div className="d-flex align-items-center mb-4">
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px',
                        fontSize: '1.5rem'
                      }}>
                        👥
                      </div>
                      <h4 className="fw-bold text-dark mb-0">Most Active Users</h4>
                    </div>
                    
                    <div className="space-y-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {stats.mostActiveUsers.map((u, i) => (
                        <div key={i} className="d-flex justify-content-between align-items-center p-3" style={{
                          background: 'rgba(255, 255, 255, 0.5)',
                          borderRadius: '10px',
                          marginBottom: '0.5rem'
                        }}>
                          <div className="d-flex align-items-center">
                            <div style={{
                              width: '35px',
                              height: '35px',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '10px',
                              color: 'white',
                              fontWeight: '600'
                            }}>
                              {i + 1}
                            </div>
                            <span className="fw-semibold text-dark">{u.user.username || u.user}</span>
                          </div>
                          <span style={{
                            background: 'rgba(13, 202, 240, 0.1)',
                            color: '#0dcaf0',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            fontWeight: '600',
                            border: '1px solid #0dcaf0'
                          }}>
                            {u.count} complaints
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="col-lg-6">
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    height: '100%'
                  }}>
                    <div className="d-flex align-items-center mb-4">
                      <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px',
                        fontSize: '1.5rem'
                      }}>
                        📋
                      </div>
                      <h4 className="fw-bold text-dark mb-0">Recent Activity</h4>
                    </div>
                    
                    <div style={{
                      background: 'rgba(248, 249, 250, 0.8)',
                      borderRadius: '15px',
                      padding: '1.5rem',
                      maxHeight: '300px',
                      overflowY: 'auto'
                    }}>
                      {stats.recentLogs.length === 0 ? (
                        <div className="text-center py-4">
                          <div style={{
                            width: '60px',
                            height: '60px',
                            background: 'rgba(108, 117, 125, 0.1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                            fontSize: '2rem'
                          }}>
                            📋
                          </div>
                          <p className="text-muted mb-0">No recent activity</p>
                        </div>
                      ) : (
                        stats.recentLogs.map((log, i) => {
                        const logEntry = log.replace(/^\[.*?\]\s*/, ''); // Remove timestamp
                        const timestamp = log.match(/^\[(.*?)\]/)?.[1] || '';
                        
                        // Determine activity type and styling
                        let activityType = 'default';
                        let icon = '📋';
                        let color = '#6c757d';
                        
                        if (logEntry.includes('LOGIN:')) {
                          activityType = 'login';
                          icon = '🔐';
                          color = '#198754';
                        } else if (logEntry.includes('LOGOUT:')) {
                          activityType = 'logout';
                          icon = '🚪';
                          color = '#dc3545';
                        } else if (logEntry.includes('COMPLAINT CREATED:')) {
                          activityType = 'complaint';
                          icon = '📝';
                          color = '#0d6efd';
                        } else if (logEntry.includes('STATUS UPDATE:')) {
                          activityType = 'status';
                          icon = '🔄';
                          color = '#ffc107';
                        }
                        
                        // Format timestamp
                        const formatTime = (timestamp) => {
                          try {
                            const date = new Date(timestamp);
                            return date.toLocaleString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            });
                          } catch {
                            return timestamp;
                          }
                        };
                        
                        return (
                          <div key={i} className="d-flex align-items-start mb-3" style={{
                            background: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: '10px',
                            padding: '12px',
                            borderLeft: `4px solid ${color}`
                          }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              background: `${color}15`,
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '12px',
                              flexShrink: 0,
                              fontSize: '1rem'
                            }}>
                              {icon}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ 
                                fontSize: '0.85rem', 
                                color: color, 
                                fontWeight: '600',
                                marginBottom: '4px'
                              }}>
                                {activityType === 'login' && 'User Login'}
                                {activityType === 'logout' && 'User Logout'}
                                {activityType === 'complaint' && 'Complaint Created'}
                                {activityType === 'status' && 'Status Updated'}
                                {activityType === 'default' && 'Activity'}
                              </div>
                              <div style={{ 
                                fontSize: '0.9rem', 
                                color: '#495057',
                                lineHeight: '1.4'
                              }}>
                                {logEntry.replace(/^(LOGIN|LOGOUT|COMPLAINT CREATED|STATUS UPDATE):\s*/, '')}
                              </div>
                              <div style={{ 
                                fontSize: '0.75rem', 
                                color: '#6c757d',
                                marginTop: '4px'
                              }}>
                                {formatTime(timestamp)}
                              </div>
                                                         </div>
                           </div>
                         );
                       })
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
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
                navigate('/admin/complaints');
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

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.1; }
            50% { transform: scale(1.1); opacity: 0.3; }
          }
        `}</style>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 
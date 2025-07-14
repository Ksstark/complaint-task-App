import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const UserDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pending: 0, inProgress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('http://localhost:5000/complaints');
        const token = localStorage.getItem('token');
        let userId = null;
        let name = '';
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userId = payload.id;
            name = payload.name || '';
          } catch {}
        }
        setUserName(name);
        const userComplaints = res.data.filter(c => c.user._id === userId);
        const pending = userComplaints.filter(c => c.status === 'Pending').length;
        const inProgress = userComplaints.filter(c => c.status === 'In Progress').length;
        const resolved = userComplaints.filter(c => c.status === 'Resolved').length;
        setStats({ pending, inProgress, resolved });
      } catch (err) {
        setError('Failed to load complaint stats');
      }
      setLoading(false);
    };
    fetchComplaints();
  }, []);

  const handleLogout = async () => {
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
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      position: 'relative',
      overflow: 'hidden'
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

      {/* Header Section */}
      <div className="container-fluid" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row py-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                  fontSize: '1.5rem'
                }}>
                  🏠
                </div>
                <h1 className="text-white mb-0 fw-bold">User Dashboard</h1>
              </div>
              <button 
                className="btn btn-outline-light px-4 py-2"
                onClick={handleLogout}
                style={{
                  borderRadius: '25px',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = 'rgba(255,255,255,0.2)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {/* Welcome Card */}
            <div className="row mb-4">
              <div className="col-12">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h2 className="fw-bold text-dark mb-2">Welcome back{userName ? `, ${userName}` : ''}! </h2>
                      <p className="text-muted mb-0">Ready to manage your complaints? Choose an action below to get started.</p>
                    </div>
                    <div className="col-md-4 text-center">
                      <div style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        fontSize: '2rem'
                      }}>
                        🎯
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="row g-4">
              {/* File Complaint Card */}
              <div className="col-md-6">
                <Link 
                  to="/user/file-complaint" 
                  className="text-decoration-none"
                  style={{
                    display: 'block',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    height: '100%'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-10px)';
                    e.target.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="text-center">
                    <div style={{
                      width: '70px',
                      height: '70px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      fontSize: '1.8rem'
                    }}>
                      📝
                    </div>
                    <h4 className="fw-bold text-dark mb-3">File New Complaint</h4>
                    <p className="text-muted mb-3">Submit a new complaint and get it resolved quickly</p>
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '25px',
                      display: 'inline-block',
                      fontWeight: '600'
                    }}>
                      Get Started →
                    </div>
                  </div>
                </Link>
              </div>

              {/* Track Complaints Card */}
              <div className="col-md-6">
                <Link 
                  to="/user/track-complaints" 
                  className="text-decoration-none"
                  style={{
                    display: 'block',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '20px',
                    padding: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    height: '100%'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-10px)';
                    e.target.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="text-center">
                    <div style={{
                      width: '70px',
                      height: '70px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      fontSize: '1.8rem'
                    }}>
                      📊
                    </div>
                    <h4 className="fw-bold text-dark mb-3">Track My Complaints</h4>
                    <p className="text-muted mb-3">Monitor the status and progress of your complaints</p>
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '25px',
                      display: 'inline-block',
                      fontWeight: '600'
                    }}>
                      View Status →
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Stats Section */}
            <div className="row mt-5">
              <div className="col-12">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                  <h4 className="fw-bold text-dark mb-4 text-center">Quick Stats</h4>
                  <div className="d-flex flex-column align-items-center mb-4">
                    <div style={{
                      width: 340,
                      height: 340,
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
                          labels: ['Pending', 'In Progress', 'Resolved'],
                          datasets: [
                            {
                              data: [stats.pending, stats.inProgress, stats.resolved],
                              backgroundColor: [
                                'rgba(255, 193, 7, 0.85)',
                                'rgba(13, 110, 253, 0.85)',
                                'rgba(25, 135, 84, 0.85)'
                              ],
                              borderColor: [
                                '#ffc107',
                                '#0d6efd',
                                '#198754'
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
                </div>
              </div>
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
      `}</style>
    </div>
  );
};

export default UserDashboard; 
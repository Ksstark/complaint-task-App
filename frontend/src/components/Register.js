import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useNavigate } from 'react-router-dom';
// import AuthLayout from './AuthLayout';

// Utility function for strong password validation (SOLID: single responsibility)
const isStrongPassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(password);
};

const Register = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'password') {
      setPasswordTouched(true);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await api.post('http://localhost:5000/auth/register', form);
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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

      <div className="container-fluid" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-10 col-xl-8">
            <div className="row shadow-lg rounded-4 overflow-hidden" style={{ 
              background: 'rgba(255, 255, 255, 0.95)', 
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              {/* Left side - Welcome section */}
              <div className="col-md-6 p-0" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div className="p-5 text-white d-flex flex-column justify-content-center h-100">
                  <div className="text-center mb-4">
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                      fontSize: '2rem'
                    }}>
                      ✨
                    </div>
                    <h2 className="fw-bold mb-3" style={{ fontSize: '2.5rem' }}>Join Us Today!</h2>
                    <p className="mb-4" style={{ fontSize: '1.1rem', opacity: 0.9 }}>
                      Create your account and start managing complaints efficiently
                    </p>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="d-flex align-items-center mb-3">
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px'
                      }}>
                        🚀
                      </div>
                      <span>Quick and easy setup</span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px'
                      }}>
                        🔒
                      </div>
                      <span>Secure and private</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'rgba(255,255,255,0.2)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px'
                      }}>
                        💎
                      </div>
                      <span>Free forever</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Register form */}
              <div className="col-md-6 p-5">
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-dark mb-2">Create Account</h3>
                  <p className="text-muted">Fill in your details to get started</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Username</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <i className="bi bi-person text-muted"></i>
                      </span>
                      <input 
                        type="text" 
                        className="form-control border-start-0" 
                        name="username" 
                        value={form.username} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter your username"
                        style={{ 
                          borderColor: '#e9ecef',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <i className="bi bi-envelope text-muted"></i>
                      </span>
                      <input 
                        type="email" 
                        className="form-control border-start-0" 
                        name="email" 
                        value={form.email} 
                        onChange={handleChange} 
                        required 
                        placeholder="Enter your email"
                        style={{ 
                          borderColor: '#e9ecef',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-transparent border-end-0">
                        <i className="bi bi-lock text-muted"></i>
                      </span>
                      <input 
                        type="password" 
                        className="form-control border-start-0" 
                        name="password" 
                        value={form.password} 
                        onChange={handleChange} 
                        required 
                        placeholder="Create a strong password"
                        style={{ 
                          borderColor: '#e9ecef',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                    {/* Password validation message */}
                    {passwordTouched && form.password && !isStrongPassword(form.password) && (
                      <div className="form-text text-danger mt-1">
                        Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                      </div>
                    )}
                  </div>

                  <button 
                    type="submit" 
                    className="btn w-100 py-3 fw-semibold" 
                    disabled={isLoading}
                    style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      color: '#fff', 
                      border: 'none',
                      borderRadius: '10px',
                      transition: 'all 0.3s ease',
                      fontSize: '1.1rem'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  {error && (
                    <div className="alert alert-danger mt-3 border-0" style={{
                      background: 'rgba(220, 53, 69, 0.1)',
                      color: '#dc3545',
                      borderRadius: '10px'
                    }}>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="alert alert-success mt-3 border-0" style={{
                      background: 'rgba(25, 135, 84, 0.1)',
                      color: '#198754',
                      borderRadius: '10px'
                    }}>
                      <i className="bi bi-check-circle me-2"></i>
                      {success}
                    </div>
                  )}
                </form>

                <div className="text-center mt-4">
                  <span className="text-muted">Already have an account? </span>
                  <Link 
                    to="/login" 
                    className="text-decoration-none fw-semibold"
                    style={{ 
                      color: '#667eea',
                      transition: 'color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#764ba2'}
                    onMouseOut={(e) => e.target.style.color = '#667eea'}
                  >
                    Sign In
                  </Link>
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
        
        .form-control:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
        }
        
        .input-group-text {
          border-color: #e9ecef !important;
        }
      `}</style>
    </div>
  );
};

export default Register; 
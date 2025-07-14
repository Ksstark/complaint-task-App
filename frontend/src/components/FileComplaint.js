import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const FileComplaint = () => {
  const [form, setForm] = useState({ title: '', description: '', department: '', priority: 'medium' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [descriptionWordCount, setDescriptionWordCount] = useState(0);

  const navigate = useNavigate();

  // Validation functions
  const validateTitleWordCount = (title) => {
    return title.trim().split(/\s+/).filter(Boolean).length <= 10;
  };
  const validateDescriptionWordCount = (description) => {
    return description.trim().split(/\s+/).filter(Boolean).length <= 100;
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'description') {
      setDescriptionWordCount(e.target.value.trim().split(/\s+/).filter(Boolean).length);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Validation
    if (!validateTitleWordCount(form.title)) {
      setError('Title must be 10 words or fewer.');
      return;
    }
    if (!validateDescriptionWordCount(form.description)) {
      setError('Description must be 100 words or fewer.');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('http://localhost:5000/complaints', form);
      setSuccess('Complaint filed successfully!');
      setForm({ title: '', description: '', department: '', priority: 'medium' });
      setDescriptionWordCount(0);
      navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to file complaint');
    } finally {
      setIsLoading(false);
    }
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

      <div className="container-fluid" style={{ position: 'relative', zIndex: 2 }}>
        <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
          <div className="col-lg-10 col-xl-8">
            {/* Header Section */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="d-flex align-items-center mb-4">
                  <Link 
                    to="/user/dashboard" 
                    className="btn btn-outline-light me-3"
                    style={{
                      borderRadius: '50%',
                      width: '50px',
                      height: '50px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
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
                    ←
                  </Link>
                  <div>
                    <h1 className="text-white mb-1 fw-bold">File New Complaint</h1>
                    <p className="text-white-50 mb-0">Submit your complaint and we'll help you resolve it</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form Card */}
            <div className="row">
              <div className="col-12">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '25px',
                  padding: '3rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                  {/* Form Header */}
                  <div className="text-center mb-4">
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.5rem',
                      fontSize: '2rem'
                    }}>
                      📝
                    </div>
                    <h3 className="fw-bold text-dark mb-2">Complaint Details</h3>
                    <p className="text-muted">Please provide all the necessary information to help us assist you better</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      {/* Title Field */}
                      <div className="col-12">
                        <div className="mb-4">
                          <label className="form-label fw-semibold text-dark">
                            <i className="bi bi-type-h1 me-2 text-primary"></i>
                            Complaint Title
                          </label>
                          <input 
                            type="text" 
                            className="form-control form-control-lg" 
                            name="title" 
                            value={form.title} 
                            onChange={handleChange} 
                            placeholder="Enter a clear title for your complaint"
                            style={{ 
                              borderColor: '#e9ecef',
                              borderRadius: '15px',
                              transition: 'all 0.3s ease',
                              padding: '1rem 1.5rem'
                            }}
                          />
                          <div className="form-text text-end" style={{ color: form.title.trim().split(/\s+/).filter(Boolean).length > 10 ? '#dc3545' : '#6c757d' }}>
                            {form.title.trim().split(/\s+/).filter(Boolean).length} / 10 words
                          </div>
                        </div>
                      </div>

                      {/* Department Field */}
                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label fw-semibold text-dark">
                            <i className="bi bi-building me-2 text-primary"></i>
                            Department
                          </label>
                          <select 
                            className="form-select form-select-lg" 
                            name="department" 
                            value={form.department} 
                            onChange={handleChange} 
                            required
                            style={{ 
                              borderColor: '#e9ecef',
                              borderRadius: '15px',
                              transition: 'all 0.3s ease',
                              padding: '1rem 1.5rem'
                            }}
                          >
                            <option value="">Select Department</option>
                            <option value="IT">Information Technology</option>
                            <option value="HR">Human Resources</option>
                            <option value="Finance">Finance</option>
                            <option value="Operations">Operations</option>
                            <option value="Customer Service">Customer Service</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>

                      {/* Priority Field */}
                      <div className="col-md-6">
                        <div className="mb-4">
                          <label className="form-label fw-semibold text-dark">
                            <i className="bi bi-flag me-2 text-primary"></i>
                            Priority Level
                          </label>
                          <select 
                            className="form-select form-select-lg"
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            required
                            style={{ 
                              borderColor: '#e9ecef',
                              borderRadius: '15px',
                              transition: 'all 0.3s ease',
                              padding: '1rem 1.5rem'
                            }}
                          >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                            <option value="urgent">Urgent</option>
                          </select>
                        </div>
                      </div>

                      {/* Description Field */}
                      <div className="col-12">
                        <div className="mb-4">
                          <label className="form-label fw-semibold text-dark">
                            <i className="bi bi-chat-text me-2 text-primary"></i>
                            Detailed Description
                          </label>
                          <textarea 
                            className="form-control" 
                            name="description" 
                            value={form.description} 
                            onChange={handleChange} 
                            required 
                            rows="6"
                            placeholder="Please provide a detailed description of your complaint. Include relevant dates, times, and any supporting information."
                            style={{ 
                              borderColor: '#e9ecef',
                              borderRadius: '15px',
                              transition: 'all 0.3s ease',
                              padding: '1rem 1.5rem',
                              resize: 'vertical'
                            }}
                          />
                          <div className="form-text text-end" style={{ color: descriptionWordCount > 100 ? '#dc3545' : '#6c757d' }}>
                            {descriptionWordCount} / 100 words
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-lg px-5 py-3 fw-semibold" 
                        disabled={isLoading}
                        style={{ 
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                          color: '#fff', 
                          border: 'none',
                          borderRadius: '25px',
                          transition: 'all 0.3s ease',
                          fontSize: '1.1rem',
                          minWidth: '200px'
                        }}
                        onMouseOver={(e) => {
                          if (!isLoading) {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 10px 25px rgba(102, 126, 234, 0.3)';
                          }
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        {isLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send me-2"></i>
                            Submit Complaint
                          </>
                        )}
                      </button>
                    </div>

                    {/* Messages */}
                    {error && (
                      <div className="alert alert-danger mt-4 border-0" style={{
                        background: 'rgba(220, 53, 69, 0.1)',
                        color: '#dc3545',
                        borderRadius: '15px',
                        border: '1px solid rgba(220, 53, 69, 0.2)'
                      }}>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="alert alert-success mt-4 border-0" style={{
                        background: 'rgba(25, 135, 84, 0.1)',
                        color: '#198754',
                        borderRadius: '15px',
                        border: '1px solid rgba(25, 135, 84, 0.2)'
                      }}>
                        <i className="bi bi-check-circle me-2"></i>
                        {success}
                      </div>
                    )}
                  </form>
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
        
        .form-control:focus, .form-select:focus {
          border-color: #667eea !important;
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25) !important;
        }
      `}</style>
    </div>
  );
};

export default FileComplaint; 
import React from 'react';

const AuthLayout = ({ children }) => (
  <div className="d-flex align-items-center justify-content-center bg-light">
    <div className="card shadow p-4" style={{ minWidth: 350, maxWidth: 400 ,}}>
      <div className="text-center mb-4">
        <h2 className="fw-bold">Complaint System</h2>
        <div className="text-muted">Please login or register to continue</div>
      </div>
      {children}
    </div>
  </div>
);

export default AuthLayout; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import FileComplaint from './components/FileComplaint';
import TrackComplaints from './components/TrackComplaints';
import AdminDashboard from './components/AdminDashboard';
import ViewComplaints from './components/ViewComplaints';
import UserDashboard from './components/UserDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NotificationProvider } from './components/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* User routes */}
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/file-complaint" element={<FileComplaint />} />
          <Route path="/user/track-complaints" element={<TrackComplaints />} />

          {/* Admin routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/complaints" element={<ViewComplaints />} />

          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </NotificationProvider>
  );
}

export default App;

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [highPriorityComplaints, setHighPriorityComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHighPriorityComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('http://localhost:5000/complaints');
      const highPriority = res.data.filter(
        c => (c.priority === 'high' || c.priority === 'urgent') && (c.status === 'Pending' || c.status === 'In Progress')
      );
      setHighPriorityComplaints(highPriority);
    } catch (err) {
      // Optionally handle error
    }
    setLoading(false);
  };

  // Fetch on mount
  useEffect(() => {
    fetchHighPriorityComplaints();
  }, []);

  // Expose a method to update the list after a status change
  const removeComplaintById = (id) => {
    setHighPriorityComplaints(prev => prev.filter(c => c._id !== id));
  };

  const value = {
    highPriorityComplaints,
    loading,
    fetchHighPriorityComplaints,
    removeComplaintById,
    setHighPriorityComplaints
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../Shared/Navbar';
import Dashboard from './Dashboard';
import Notifications from './Notifications';
import Members from './Members';
import Events from './Events';
import Calendar from './Calendar';

import './AdminDashboard.css';

const AdminDashboard = () => {
  const navLinks = [
    { path: '/admin', label: 'Dashboard', icon: '' },
    { path: '/admin/notifications', label: 'Notifications', icon: '' },
    { path: '/admin/members', label: 'Members', icon: '' },
    { path: '/admin/events', label: 'Events', icon: '' },
    { path: '/admin/calendar', label: 'Calendar', icon: '' },
    
  ];

  return (
    <div className="admin-dashboard">
      <Navbar links={navLinks} />
      <div className="dashboard-content">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="members" element={<Members />} />
          <Route path="events" element={<Events />} />
          <Route path="calendar" element={<Calendar />} />
         
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;

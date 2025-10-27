import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../Shared/Navbar';
import Dashboard from './Dashboard';
import Notifications from './Notifications';
import Members from './Members';
import Events from './Events';
import Profile from './Profile';
import './MemberDashboard.css';
import Calendar from './Calendar';

const MemberDashboard = () => {
  const navLinks = [
    { path: '/member', label: 'Dashboard', icon: '🏠' },
    { path: '/member/notifications', label: 'Notifications', icon: '📢' },
    { path: '/member/members', label: 'Members', icon: '👥' },
    { path: '/member/events', label: 'Events', icon: '📅' },
    { path: '/member/calendar', label: 'Calendar', icon: '🗓️' },
    { path: '/member/profile', label: 'Profile', icon: '👤' }
  ];

  return (
    <div className="member-dashboard">
      <Navbar links={navLinks} />
      <div className="dashboard-content">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="members" element={<Members />} />
          <Route path="events" element={<Events />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/member" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default MemberDashboard;

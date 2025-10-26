import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import MemberDashboard from './components/Member/MemberDashboard';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { currentUser } = useApp();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && currentUser.role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function AppRoutes() {
  const { currentUser } = useApp();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to={currentUser.role === 'admin' ? '/admin' : '/member'} replace /> : <Login />}  
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/member/*"
        element={
          <ProtectedRoute requiredRole="member">
            <MemberDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

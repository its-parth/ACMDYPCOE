import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import './Login.css';

const Login = () => { 
  const navigate = useNavigate();
  const { login } = useApp();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'member'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(formData.email, formData.password, formData.role);
    setLoading(false);

    if (result.ok) {
      navigate(formData.role === 'admin' ? '/admin' : '/member');
    } else {
      setError(result.error || 'Invalid credentials. Please try again.');
    }
  };

  // Quick login demo credentials (fills form, still requires backend user to exist)
  const quickLogin = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@acm.org',
        password: 'admin123',
        role: 'admin'
      });
    } else {
      setFormData({
        email: 'sarah.j@acm.org',
        password: 'member123',
        role: 'member'
      });
    }
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card fade-in">
        <div className="login-header">
          <div className="logo">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="50" height="50" rx="12" fill="#0066cc"/>
              <path d="M15 35L25 15L35 35M19 28H31" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1>ACM Club</h1>
          <p>Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="input-group">
            <label htmlFor="role">Login as</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-section">
          <p className="demo-title">Quick Demo Login:</p>
          <div className="demo-buttons">
            <button 
              type="button"
              onClick={() => quickLogin('admin')} 
              className="btn btn-secondary"
            >
              🔐 Admin Demo
            </button>
            <button 
              type="button"
              onClick={() => quickLogin('member')} 
              className="btn btn-secondary"
            >
              👤 Member Demo
            </button>
          </div>
          <p className="demo-note">
            Click a demo button to auto-fill credentials, then click Sign In
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

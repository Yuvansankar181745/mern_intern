import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginSuccess.css';

const LoginSuccess = ({ role }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const roleDisplay = (user?.role || role) === 'admin' ? 'Admin' : 'User';
  const roleIcon = (user?.role || role) === 'admin' ? '👑' : '👤';

  return (
    <div className="login-success-container">
      <div className="login-success-card">
        <div className="success-icon">✓</div>
        <h2>Login Successful!</h2>
        <div className={`role-display role-${user?.role || role || 'user'}`}>
          <span className="role-icon">{roleIcon}</span>
          <span className="role-text">Logged in as {roleDisplay}</span>
        </div>
        <p className="redirect-message">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default LoginSuccess;


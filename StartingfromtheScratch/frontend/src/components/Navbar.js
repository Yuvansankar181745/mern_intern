import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={user && user.role === 'admin' ? '/admin' : '/dashboard'} className="navbar-brand">
          Mobile Recharge
        </Link>
        {user && (
          <>
            <div className="navbar-menu">
              {user.role === 'admin' ? (
                <>
                  <Link to="/admin" className="navbar-link">Admin Dashboard</Link>
                  <Link to="/admin/plans" className="navbar-link">Manage Plans</Link>
                  <Link to="/admin/transactions" className="navbar-link">Transactions</Link>
                  <Link to="/admin/users" className="navbar-link">Users</Link>
                  <Link to="/admin/analytics" className="navbar-link">Analytics</Link>
                </>
              ) : (
                <>
                  <Link to="/dashboard" className="navbar-link">Dashboard</Link>
                  <Link to="/recharge" className="navbar-link">Recharge</Link>
                  <Link to="/plans" className="navbar-link">Plans</Link>
                  <Link to="/bills" className="navbar-link">Bills</Link>
                  <Link to="/transactions" className="navbar-link">Transactions</Link>
                  <Link to="/wallet" className="navbar-link">Wallet</Link>
                  <Link to="/notifications" className="navbar-link">
                    Notifications
                  </Link>
                </>
              )}
            </div>
            <div className="navbar-user">
              <div className="user-info">
                <span className="navbar-user-name">{user.name}</span>
                <span className={`user-role-badge role-${user.role || 'user'}`}>
                  {user.role === 'admin' ? '👑 Admin' : '👤 User'}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


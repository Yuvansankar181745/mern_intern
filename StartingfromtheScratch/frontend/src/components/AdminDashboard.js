import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading admin dashboard...</div>;
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="container">
          <div className="welcome-header">
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage your mobile recharge platform</p>
            </div>
            <div className="user-role-badge-large role-admin">
              👑 Admin
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="admin-stats-grid">
          <div className="admin-stat-card stat-primary">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Users</h3>
              <div className="stat-value">{stats?.stats?.totalUsers || 0}</div>
            </div>
          </div>

          <div className="admin-stat-card stat-success">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Total Revenue</h3>
              <div className="stat-value">₹{(stats?.stats?.totalRevenue || 0).toFixed(2)}</div>
            </div>
          </div>

          <div className="admin-stat-card stat-info">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>Total Transactions</h3>
              <div className="stat-value">{stats?.stats?.totalTransactions || 0}</div>
            </div>
          </div>

          <div className="admin-stat-card stat-warning">
            <div className="stat-icon">📱</div>
            <div className="stat-content">
              <h3>Active Plans</h3>
              <div className="stat-value">{stats?.stats?.totalPlans || 0}</div>
            </div>
          </div>
        </div>

        <div className="admin-actions-grid">
          <Link to="/admin/plans" className="admin-action-card">
            <div className="action-icon">📋</div>
            <h3>Manage Plans</h3>
            <p>Add, edit, or delete recharge plans</p>
          </Link>

          <Link to="/admin/transactions" className="admin-action-card">
            <div className="action-icon">💳</div>
            <h3>View Transactions</h3>
            <p>Monitor all transactions and revenue</p>
          </Link>

          <Link to="/admin/users" className="admin-action-card">
            <div className="action-icon">👤</div>
            <h3>Manage Users</h3>
            <p>View and manage user accounts</p>
          </Link>

          <Link to="/admin/analytics" className="admin-action-card">
            <div className="action-icon">📈</div>
            <h3>Analytics</h3>
            <p>View detailed statistics and reports</p>
          </Link>
        </div>

        <div className="grid">
          <div className="card">
            <h2>Recent Transactions</h2>
            {stats?.recentTransactions?.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions.map((txn) => (
                    <tr key={txn._id}>
                      <td>{txn.userId?.name || 'N/A'}</td>
                      <td>{txn.type}</td>
                      <td>₹{txn.amount}</td>
                      <td>
                        <span className={`badge badge-${txn.status}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No recent transactions</p>
            )}
          </div>

          <div className="card">
            <h2>Recent Users</h2>
            {stats?.recentUsers?.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Balance</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>₹{user.walletBalance}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


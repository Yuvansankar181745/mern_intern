import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState({
    balance: 0,
    recentTransactions: [],
    unreadNotifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [balanceRes, transactionsRes, notificationsRes] = await Promise.all([
        axios.get('/api/wallet/balance'),
        axios.get('/api/transactions?limit=5'),
        axios.get('/api/notifications/unread/count')
      ]);

      setStats({
        balance: balanceRes.data.balance,
        recentTransactions: transactionsRes.data.transactions,
        unreadNotifications: notificationsRes.data.count
      });

      // Update user balance
      if (user) {
        updateUser({ ...user, walletBalance: balanceRes.data.balance });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="container">
          <div className="welcome-header">
            <div>
              <h1>Welcome, {user?.name}!</h1>
              <p>Manage your mobile recharges and bills</p>
            </div>
            <div className={`user-role-badge-large role-${user?.role || 'user'}`}>
              {user?.role === 'admin' ? '👑 Admin' : '👤 User'}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="grid">
          <div className="stats-card">
            <h3>Wallet Balance</h3>
            <div className="amount">₹{stats.balance.toFixed(2)}</div>
            <Link to="/wallet" className="btn btn-secondary" style={{ marginTop: '15px', display: 'inline-block', textDecoration: 'none' }}>
              Top Up
            </Link>
          </div>
          <div className="card">
            <h3>Quick Actions</h3>
            <div className="quick-actions">
              <Link to="/recharge" className="btn btn-primary">Mobile Recharge</Link>
              <Link to="/bills" className="btn btn-primary">Pay Bills</Link>
              <Link to="/plans" className="btn btn-primary">View Plans</Link>
            </div>
          </div>
          <div className="card">
            <h3>Notifications</h3>
            <p>You have {stats.unreadNotifications} unread notifications</p>
            <Link to="/notifications" className="btn btn-secondary">View All</Link>
          </div>
        </div>

        <div className="card">
          <h3>Recent Transactions</h3>
          {stats.recentTransactions.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Type</th>
                  <th>Mobile Number</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((txn) => (
                  <tr key={txn._id}>
                    <td>{txn.transactionId}</td>
                    <td>{txn.type}</td>
                    <td>{txn.mobileNumber}</td>
                    <td>₹{txn.amount}</td>
                    <td>
                      <span className="payment-method-badge">
                        {txn.paymentMethod ? txn.paymentMethod.replace('_', ' ').toUpperCase() : 'WALLET'}
                      </span>
                    </td>
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
            <p>No transactions yet</p>
          )}
          <Link to="/transactions" className="btn btn-secondary" style={{ marginTop: '15px' }}>
            View All Transactions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


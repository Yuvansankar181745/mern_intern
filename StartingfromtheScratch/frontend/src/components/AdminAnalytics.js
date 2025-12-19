import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminAnalytics.css';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [dashboardRes, transactionStatsRes] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/admin/transactions/stats')
      ]);

      setStats({
        dashboard: dashboardRes.data,
        transactions: transactionStatsRes.data
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="container">
          <h1>Analytics & Reports</h1>
          <p>Detailed statistics and insights</p>
        </div>
      </div>

      <div className="container">
        <div className="analytics-grid">
          <div className="card">
            <h2>Transaction Statistics</h2>
            {stats?.transactions?.byType && (
              <div className="stats-list">
                {stats.transactions.byType.map((item) => (
                  <div key={item._id} className="stat-item">
                    <div className="stat-label">{item._id.replace('_', ' ')}</div>
                    <div className="stat-numbers">
                      <span className="stat-count">{item.count} transactions</span>
                      <span className="stat-amount">₹{item.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2>Status Breakdown</h2>
            {stats?.transactions?.byStatus && (
              <div className="stats-list">
                {stats.transactions.byStatus.map((item) => (
                  <div key={item._id} className="stat-item">
                    <div className="stat-label">{item._id}</div>
                    <div className="stat-numbers">
                      <span className="stat-count">{item.count} transactions</span>
                      <span className="stat-amount">₹{item.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2>Overall Statistics</h2>
          <div className="overall-stats">
            <div className="overall-stat">
              <h3>Total Users</h3>
              <div className="stat-value-large">{stats?.dashboard?.stats?.totalUsers || 0}</div>
            </div>
            <div className="overall-stat">
              <h3>Total Transactions</h3>
              <div className="stat-value-large">{stats?.dashboard?.stats?.totalTransactions || 0}</div>
            </div>
            <div className="overall-stat">
              <h3>Total Revenue</h3>
              <div className="stat-value-large">₹{(stats?.dashboard?.stats?.totalRevenue || 0).toFixed(2)}</div>
            </div>
            <div className="overall-stat">
              <h3>Active Plans</h3>
              <div className="stat-value-large">{stats?.dashboard?.stats?.totalPlans || 0}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;


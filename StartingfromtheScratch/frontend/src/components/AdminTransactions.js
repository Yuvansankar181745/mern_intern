import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminTransactions.css';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    page: 1,
    limit: 50
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: filters.limit,
        page: filters.page
      });
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);

      const response = await axios.get(`/api/admin/transactions?${params}`);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/transactions/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, [fetchTransactions, fetchStats]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1
    });
  };

  if (loading && !transactions.length) {
    return <div className="loading">Loading transactions...</div>;
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="container">
          <h1>Transaction Management</h1>
          <p>View and manage all transactions</p>
        </div>
      </div>

      <div className="container">
        {stats && (
          <div className="admin-stats-grid">
            <div className="admin-stat-card stat-info">
              <div className="stat-icon">💳</div>
              <div className="stat-content">
                <h3>Total Transactions</h3>
                <div className="stat-value">{stats.overall?.totalCount || 0}</div>
              </div>
            </div>

            <div className="admin-stat-card stat-success">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <h3>Total Revenue</h3>
                <div className="stat-value">₹{(stats.overall?.totalAmount || 0).toFixed(2)}</div>
              </div>
            </div>

            <div className="admin-stat-card stat-primary">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>Successful</h3>
                <div className="stat-value">{stats.overall?.successCount || 0}</div>
              </div>
            </div>

            <div className="admin-stat-card stat-warning">
              <div className="stat-icon">📊</div>
              <div className="stat-content">
                <h3>Success Revenue</h3>
                <div className="stat-value">₹{(stats.overall?.successAmount || 0).toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <div className="filter-section">
            <div className="filter-group">
              <label>Filter by Type:</label>
              <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">All Types</option>
                <option value="recharge">Recharge</option>
                <option value="bill_payment">Bill Payment</option>
                <option value="wallet_topup">Wallet Top-up</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Filter by Status:</label>
              <select name="status" value={filters.status} onChange={handleFilterChange}>
                <option value="">All Status</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {transactions.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Mobile Number</th>
                    <th>Operator</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((txn) => (
                    <tr key={txn._id}>
                      <td>{txn.transactionId}</td>
                      <td>{txn.userId?.name || 'N/A'}</td>
                      <td className="transaction-type">{txn.type.replace('_', ' ')}</td>
                      <td>{txn.mobileNumber}</td>
                      <td>{txn.operator}</td>
                      <td className="amount">₹{txn.amount}</td>
                      <td>
                        <span className={`badge badge-${txn.status}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td>{new Date(txn.createdAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">No transactions found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTransactions;


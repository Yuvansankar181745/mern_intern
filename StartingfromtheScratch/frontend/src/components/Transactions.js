import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Transactions.css';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    page: 1,
    limit: 20
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: filters.limit,
        page: filters.page
      });
      if (filters.type) {
        params.append('type', filters.type);
      }

      const response = await axios.get(`/api/transactions?${params}`);
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      type: e.target.value,
      page: 1
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'success':
        return 'badge-success';
      case 'pending':
        return 'badge-pending';
      case 'failed':
        return 'badge-failed';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading transactions...</div>;
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="container">
          <h1>Transaction History</h1>
          <p>View all your transactions</p>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div className="filter-section">
            <label>Filter by Type:</label>
            <select value={filters.type} onChange={handleFilterChange}>
              <option value="">All Transactions</option>
              <option value="recharge">Recharge</option>
              <option value="bill_payment">Bill Payment</option>
              <option value="wallet_topup">Wallet Top-up</option>
            </select>
          </div>

          {transactions.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Type</th>
                  <th>Mobile Number</th>
                  <th>Operator</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id}>
                    <td>{txn.transactionId}</td>
                    <td className="transaction-type">{txn.type.replace('_', ' ')}</td>
                    <td>{txn.mobileNumber}</td>
                    <td>{txn.operator}</td>
                    <td className="amount">₹{txn.amount}</td>
                    <td>
                      <span className="payment-method-badge">
                        {txn.paymentMethod ? txn.paymentMethod.replace('_', ' ').toUpperCase() : 'WALLET'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(txn.status)}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td>{new Date(txn.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No transactions found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transactions;


import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Wallet.css';

const Wallet = () => {
  const { user, updateUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [topupAmount, setTopupAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactions, setTransactions] = useState([]);

  const fetchWalletData = useCallback(async () => {
    try {
      const [balanceRes, transactionsRes] = await Promise.all([
        axios.get('/api/wallet/balance'),
        axios.get('/api/wallet/transactions')
      ]);

      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data.transactions);
      updateUser({ ...user, walletBalance: balanceRes.data.balance });
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  }, [updateUser, user]);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const handleTopup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('/api/wallet/topup', {
        amount: parseFloat(topupAmount)
      });

      setSuccess(response.data.message);
      setBalance(response.data.balance);
      updateUser({ ...user, walletBalance: response.data.balance });
      setTopupAmount('');
      fetchWalletData();
    } catch (error) {
      setError(error.response?.data?.error || 'Top-up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="container">
          <h1>Wallet</h1>
          <p>Manage your wallet balance</p>
        </div>
      </div>

      <div className="container">
        <div className="grid">
          <div className="card wallet-balance-card">
            <h2>Current Balance</h2>
            <div className="balance-amount">₹{balance.toFixed(2)}</div>
            <p className="balance-info">Available for recharges and bill payments</p>
          </div>

          <div className="card">
            <h2>Top Up Wallet</h2>
            <form onSubmit={handleTopup}>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Top Up'}
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <h2>Top-up History</h2>
          {transactions.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn._id}>
                    <td>{txn.transactionId}</td>
                    <td className="amount">₹{txn.amount}</td>
                    <td>
                      <span className="badge badge-success">{txn.status}</span>
                    </td>
                    <td>{new Date(txn.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No top-up transactions yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;


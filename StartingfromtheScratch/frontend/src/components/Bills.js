import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Bills.css';

const Bills = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    mobileNumber: '',
    operator: '',
    amount: '',
    billType: ''
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBillHistory();
  }, []);

  const fetchBillHistory = async () => {
    try {
      const response = await axios.get('/api/bills/history');
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching bill history:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await axios.post('/api/bills/pay', formData);
      setSuccess(response.data.message);
      updateUser({ ...user, walletBalance: response.data.walletBalance });
      setFormData({
        mobileNumber: '',
        operator: '',
        amount: '',
        billType: ''
      });
      fetchBillHistory();
    } catch (error) {
      setError(error.response?.data?.error || 'Bill payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="container">
          <h1>Bill Payment</h1>
          <p>Pay your postpaid bills instantly</p>
        </div>
      </div>

      <div className="container">
        <div className="grid">
          <div className="card">
            <h2>Pay Bill</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="10 digit mobile number"
                  maxLength="10"
                  required
                />
              </div>
              <div className="form-group">
                <label>Operator</label>
                <select
                  name="operator"
                  value={formData.operator}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Operator</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Jio">Jio</option>
                  <option value="Vi">Vi</option>
                  <option value="BSNL">BSNL</option>
                </select>
              </div>
              <div className="form-group">
                <label>Bill Type</label>
                <select
                  name="billType"
                  value={formData.billType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Bill Type</option>
                  <option value="Postpaid">Postpaid</option>
                  <option value="DTH">DTH</option>
                  <option value="Broadband">Broadband</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter bill amount"
                  min="1"
                  required
                />
              </div>
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Pay Bill'}
              </button>
            </form>
          </div>
        </div>

        <div className="card">
          <h2>Bill Payment History</h2>
          {transactions.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
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
                    <td>{txn.mobileNumber}</td>
                    <td>{txn.operator}</td>
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
            <p className="no-data">No bill payments yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bills;


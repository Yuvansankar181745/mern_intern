import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PaymentModal from './PaymentModal';
import './Recharge.css';

const Recharge = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    mobileNumber: '',
    operator: '',
    amount: '',
    circle: '',
    planId: ''
  });
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPlans, setShowPlans] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        operator: location.state.operator || '',
        amount: location.state.amount || '',
        planId: location.state.planId || ''
      }));
    }
  }, [location.state]);

  const fetchPlans = useCallback(async () => {
    try {
      const response = await axios.get(`/api/plans?operator=${formData.operator}`);
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  }, [formData.operator]);

  useEffect(() => {
    if (formData.operator) {
      fetchPlans();
    }
  }, [formData.operator, fetchPlans]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
    setSuccess('');
  };

  const selectPlan = (plan) => {
    setFormData({
      ...formData,
      amount: plan.price,
      planId: plan._id
    });
    setShowPlans(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Show payment modal instead of directly processing
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentData) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Extract payment method from payment data object
      const paymentMethod = paymentData?.method || paymentData || 'wallet';
      
      const rechargePayload = {
        mobileNumber: formData.mobileNumber,
        operator: formData.operator,
        amount: parseFloat(formData.amount), // Ensure amount is a number
        circle: formData.circle,
        planId: formData.planId || null,
        paymentMethod: paymentMethod // Pass the method string to backend
      };
      
      const response = await axios.post('/api/recharge', rechargePayload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setSuccess(response.data.message);
      updateUser({ ...user, walletBalance: response.data.walletBalance });
      setFormData({
        mobileNumber: '',
        operator: '',
        amount: '',
        circle: '',
        planId: ''
      });
      setShowPaymentModal(false);
      
      // Navigate to transactions after successful recharge
      setTimeout(() => {
        navigate('/transactions');
      }, 2000);
    } catch (error) {
      console.error('Recharge error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.errors?.[0]?.msg || 
                          'Recharge failed. Please try again.';
      setError(errorMessage);
      setShowPaymentModal(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="container">
          <h1>Mobile Recharge</h1>
          <p>Recharge your mobile number instantly</p>
        </div>
      </div>

      <div className="container">
        <div className="grid">
          <div className="card">
            <h2>Recharge Now</h2>
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
                <label>Circle</label>
                <select
                  name="circle"
                  value={formData.circle}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Circle</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="UP">UP</option>
                </select>
              </div>
              <div className="form-group">
                <label>Amount</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    min="1"
                    required
                  />
                  {formData.operator && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowPlans(!showPlans)}
                    >
                      View Plans
                    </button>
                  )}
                </div>
              </div>
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Processing...' : 'Recharge Now'}
              </button>
            </form>
          </div>

          <PaymentModal
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            amount={formData.amount}
            onPaymentSuccess={handlePaymentSuccess}
            rechargeData={formData}
          />

          {showPlans && plans.length > 0 && (
            <div className="card">
              <h2>Available Plans</h2>
              <div className="plans-list">
                {plans.map((plan) => (
                  <div
                    key={plan._id}
                    className="plan-item"
                    onClick={() => selectPlan(plan)}
                  >
                    <div className="plan-header">
                      <h3>{plan.planName}</h3>
                      <div className="plan-price">₹{plan.price}</div>
                    </div>
                    <div className="plan-details">
                      <p>Validity: {plan.validity}</p>
                      <p>Data: {plan.data}</p>
                      <p>Talktime: {plan.talktime}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Recharge;


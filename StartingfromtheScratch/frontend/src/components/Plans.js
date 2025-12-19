import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Plans.css';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (selectedOperator) {
      setFilteredPlans(plans.filter(plan => plan.operator === selectedOperator));
    } else {
      setFilteredPlans(plans);
    }
  }, [selectedOperator, plans]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/plans');
      setPlans(response.data.plans);
      setFilteredPlans(response.data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    navigate('/recharge', {
      state: {
        operator: plan.operator,
        amount: plan.price,
        planId: plan._id
      }
    });
  };

  const operators = ['Airtel', 'Jio', 'Vi', 'BSNL'];

  const getOperatorColor = (operator) => {
    const colors = {
      'Airtel': '#E60012',
      'Jio': '#FF6B00',
      'Vi': '#990099',
      'BSNL': '#FF6600'
    };
    return colors[operator] || '#667eea';
  };

  const groupPlansByValidity = (plans) => {
    const grouped = {};
    plans.forEach(plan => {
      const validity = plan.validity;
      if (!grouped[validity]) {
        grouped[validity] = [];
      }
      grouped[validity].push(plan);
    });
    return grouped;
  };

  if (loading) {
    return <div className="loading">Loading plans...</div>;
  }

  const groupedPlans = groupPlansByValidity(filteredPlans);
  const validityOrder = ['1 day', '7 days', '28 days', '56 days', '84 days', '365 days'];

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="container">
          <h1>Recharge Plans</h1>
          <p>Choose from {filteredPlans.length} available plans</p>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div className="operator-filters">
            <button
              className={`operator-btn ${selectedOperator === '' ? 'active' : ''}`}
              onClick={() => setSelectedOperator('')}
            >
              All Operators ({plans.length})
            </button>
            {operators.map((op) => {
              const count = plans.filter(p => p.operator === op).length;
              return (
                <button
                  key={op}
                  className={`operator-btn ${selectedOperator === op ? 'active' : ''}`}
                  onClick={() => setSelectedOperator(op)}
                >
                  {op} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {filteredPlans.length > 0 ? (
          <>
            {validityOrder.map(validity => {
              if (!groupedPlans[validity] || groupedPlans[validity].length === 0) return null;
              
              return (
                <div key={validity} className="validity-section">
                  <div className="validity-header">
                    <h2>{validity} Plans</h2>
                    <span className="plan-count">{groupedPlans[validity].length} plans</span>
                  </div>
                  <div className="plans-grid">
                    {groupedPlans[validity].map((plan) => (
                      <div 
                        key={plan._id} 
                        className="plan-card"
                        style={{ borderTop: `4px solid ${getOperatorColor(plan.operator)}` }}
                      >
                        <div className="plan-card-header">
                          <div className="plan-operator-badge" style={{ backgroundColor: getOperatorColor(plan.operator) }}>
                            {plan.operator}
                          </div>
                          <div className="plan-price-large">₹{plan.price}</div>
                          <div className="plan-name">{plan.planName}</div>
                        </div>
                        <div className="plan-card-body">
                          <div className="plan-feature">
                            <span className="feature-icon">📅</span>
                            <div>
                              <span className="feature-label">Validity</span>
                              <span className="feature-value">{plan.validity}</span>
                            </div>
                          </div>
                          <div className="plan-feature">
                            <span className="feature-icon">📶</span>
                            <div>
                              <span className="feature-label">Data</span>
                              <span className="feature-value">{plan.data}</span>
                            </div>
                          </div>
                          <div className="plan-feature">
                            <span className="feature-icon">📞</span>
                            <div>
                              <span className="feature-label">Talktime</span>
                              <span className="feature-value">{plan.talktime}</span>
                            </div>
                          </div>
                          {plan.description && (
                            <p className="plan-description">{plan.description}</p>
                          )}
                        </div>
                        <button
                          className="btn btn-primary plan-select-btn"
                          onClick={() => handleSelectPlan(plan)}
                          style={{ background: `linear-gradient(135deg, ${getOperatorColor(plan.operator)} 0%, ${getOperatorColor(plan.operator)}dd 100%)` }}
                        >
                          Select Plan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="card">
            <div className="no-plans-message">
              <h3>No Plans Available</h3>
              <p>Plans haven't been initialized yet. Please run:</p>
              <code>npm run init-plans</code>
              <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                Or contact admin to add recharge plans.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;


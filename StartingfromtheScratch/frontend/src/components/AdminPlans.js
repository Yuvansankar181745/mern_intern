import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPlans.css';

const AdminPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    operator: '',
    planName: '',
    price: '',
    validity: '',
    data: '',
    talktime: 'Unlimited',
    description: '',
    isActive: true
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/admin/plans');
      setPlans(response.data.plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingPlan) {
        await axios.put(`/api/admin/plans/${editingPlan._id}`, formData);
        setSuccess('Plan updated successfully');
      } else {
        await axios.post('/api/admin/plans', formData);
        setSuccess('Plan created successfully');
      }
      
      setShowForm(false);
      setEditingPlan(null);
      setFormData({
        operator: '',
        planName: '',
        price: '',
        validity: '',
        data: '',
        talktime: 'Unlimited',
        description: '',
        isActive: true
      });
      fetchPlans();
    } catch (error) {
      setError(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      operator: plan.operator,
      planName: plan.planName,
      price: plan.price,
      validity: plan.validity,
      data: plan.data,
      talktime: plan.talktime,
      description: plan.description || '',
      isActive: plan.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/plans/${id}`);
      setSuccess('Plan deleted successfully');
      fetchPlans();
    } catch (error) {
      setError(error.response?.data?.error || 'Delete failed');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlan(null);
    setFormData({
      operator: '',
      planName: '',
      price: '',
      validity: '',
      data: '',
      talktime: 'Unlimited',
      description: '',
      isActive: true
    });
  };

  if (loading) {
    return <div className="loading">Loading plans...</div>;
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="container">
          <h1>Manage Recharge Plans</h1>
          <p>Add, edit, or delete recharge plans</p>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div className="admin-header">
            <h2>Plans Management</h2>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancel' : '+ Add New Plan'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="plan-form">
              <div className="form-row">
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
                  <label>Plan Name</label>
                  <input
                    type="text"
                    name="planName"
                    value={formData.planName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="1"
                    step="0.01"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Validity</label>
                  <input
                    type="text"
                    name="validity"
                    value={formData.validity}
                    onChange={handleChange}
                    placeholder="e.g., 28 days"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data</label>
                  <input
                    type="text"
                    name="data"
                    value={formData.data}
                    onChange={handleChange}
                    placeholder="e.g., 2GB/day"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Talktime</label>
                  <input
                    type="text"
                    name="talktime"
                    value={formData.talktime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  Active Plan
                </label>
              </div>

              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="card">
          <h2>All Plans</h2>
          {plans.length > 0 ? (
            <div className="plans-table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Operator</th>
                    <th>Plan Name</th>
                    <th>Price</th>
                    <th>Validity</th>
                    <th>Data</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => (
                    <tr key={plan._id}>
                      <td>{plan.operator}</td>
                      <td>{plan.planName}</td>
                      <td>₹{plan.price}</td>
                      <td>{plan.validity}</td>
                      <td>{plan.data}</td>
                      <td>
                        <span className={`badge ${plan.isActive ? 'badge-success' : 'badge-failed'}`}>
                          {plan.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleEdit(plan)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(plan._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No plans found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPlans;


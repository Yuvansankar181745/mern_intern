import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const response = await axios.get(`/api/admin/users?${params}`);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleViewUser = async (userId) => {
    try {
      const response = await axios.get(`/api/admin/users/${userId}`);
      setSelectedUser(response.data.user);
      setUserTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
      if (selectedUser && selectedUser._id === userId) {
        setSelectedUser({ ...selectedUser, role: newRole });
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="container">
          <h1>User Management</h1>
          <p>View and manage user accounts</p>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search users by name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>

          {users.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Wallet Balance</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>₹{user.walletBalance.toFixed(2)}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="role-select"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleViewUser(user._id)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-data">No users found</p>
          )}
        </div>

        {selectedUser && (
          <div className="card">
            <div className="user-details-header">
              <h2>User Details: {selectedUser.name}</h2>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedUser(null);
                  setUserTransactions([]);
                }}
              >
                Close
              </button>
            </div>

            <div className="user-info-grid">
              <div>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Phone:</strong> {selectedUser.phone}</p>
                <p><strong>Wallet Balance:</strong> ₹{selectedUser.walletBalance.toFixed(2)}</p>
                <p><strong>Role:</strong> {selectedUser.role}</p>
                <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <h3>Recent Transactions</h3>
            {userTransactions.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {userTransactions.map((txn) => (
                    <tr key={txn._id}>
                      <td>{txn.transactionId}</td>
                      <td>{txn.type}</td>
                      <td>₹{txn.amount}</td>
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
            ) : (
              <p>No transactions found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Recharge from './components/Recharge';
import Transactions from './components/Transactions';
import Wallet from './components/Wallet';
import Plans from './components/Plans';
import Bills from './components/Bills';
import Notifications from './components/Notifications';
import AdminDashboard from './components/AdminDashboard';
import AdminPlans from './components/AdminPlans';
import AdminTransactions from './components/AdminTransactions';
import AdminUsers from './components/AdminUsers';
import AdminAnalytics from './components/AdminAnalytics';
import { AuthProvider, useAuth } from './context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

const UserRoute = ({ children }) => {
  const { user } = useAuth();
  // If admin tries to access user routes, redirect to admin panel
  if (user && user.role === 'admin') {
    return <Navigate to="/admin" />;
  }
  return user ? children : <Navigate to="/login" />;
};

const HomeRedirect = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.role === 'admin') {
    return <Navigate to="/admin" />;
  }
  return <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <UserRoute>
            <Dashboard />
          </UserRoute>
        }
      />
      <Route
        path="/recharge"
        element={
          <UserRoute>
            <Recharge />
          </UserRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <UserRoute>
            <Transactions />
          </UserRoute>
        }
      />
      <Route
        path="/wallet"
        element={
          <UserRoute>
            <Wallet />
          </UserRoute>
        }
      />
      <Route
        path="/plans"
        element={
          <UserRoute>
            <Plans />
          </UserRoute>
        }
      />
      <Route
        path="/bills"
        element={
          <UserRoute>
            <Bills />
          </UserRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <UserRoute>
            <Notifications />
          </UserRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/plans"
        element={
          <AdminRoute>
            <AdminPlans />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <AdminRoute>
            <AdminTransactions />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminUsers />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        }
      />
      <Route path="/" element={<HomeRedirect />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;


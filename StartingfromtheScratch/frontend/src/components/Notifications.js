import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const url = filter === 'unread' 
        ? '/api/notifications?unreadOnly=true'
        : '/api/notifications';
      
      const response = await axios.get(url);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const markAsRead = useCallback(async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    try {
      await axios.put('/api/notifications/read-all');
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, [fetchNotifications]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      default:
        return 'ℹ';
    }
  };

  const getNotificationClass = (type, isRead) => {
    let classes = 'notification-item';
    if (!isRead) {
      classes += ' unread';
    }
    classes += ` notification-${type}`;
    return classes;
  };

  if (loading) {
    return <div className="loading">Loading notifications...</div>;
  }

  return (
    <div className="main-content">
      <div className="page-header">
        <div className="container">
          <h1>Notifications</h1>
          <p>Stay updated with your account activity</p>
        </div>
      </div>

      <div className="container">
        <div className="card">
          <div className="notifications-header">
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                Unread
              </button>
            </div>
            {notifications.some(n => !n.isRead) && (
              <button className="btn btn-secondary" onClick={markAllAsRead}>
                Mark All as Read
              </button>
            )}
          </div>

          {notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={getNotificationClass(notification.type, notification.isRead)}
                  onClick={() => !notification.isRead && markAsRead(notification._id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">{notification.title}</div>
                    <div className="notification-message">{notification.message}</div>
                    <div className="notification-time">
                      {new Date(notification.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="notification-badge">New</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data">No notifications</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;


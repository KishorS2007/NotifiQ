import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const login = (email, password) => {
  return client.post('/auth/login', { email, password });
};

export const register = (userName, email, password) => {
  return client.post('/auth/register', { userName, email, password });
};

export const getReminders = (page = 0, size = 50, filters = {}) => {
  const params = new URLSearchParams({ page, size });
  if (filters.keyword) params.append('keyword', filters.keyword);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.status) params.append('status', filters.status);
  if (filters.reminderFrom) params.append('reminderFrom', filters.reminderFrom);
  if (filters.reminderTo) params.append('reminderTo', filters.reminderTo);

  return client.get(`/reminders?${params.toString()}`);
};

export const getReminderById = (id) => {
  return client.get(`/reminders/${id}`);
};

export const createReminder = (data) => {
  return client.post('/reminders', data);
};

export const updateReminder = (id, data) => {
  return client.patch(`/reminders/${id}`, data);
};

export const deleteReminder = (id) => {
  return client.delete(`/reminders/${id}`);
};

export const getUnreadNotifications = () => {
  return client.get('/notifications');
};

export const getNotificationById = (id) => {
  return client.get(`/notifications/${id}`);
};

export const markNotificationRead = (id) => {
  return client.patch(`/notifications/${id}`);
};

export const markAllNotificationsRead = () => {
  return client.patch('/notifications');
};

export default client;

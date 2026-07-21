import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button,
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
  TextField,
  MenuItem
} from '@mui/material';
import { getReminders, deleteReminder } from '../api/client';
import { wsService } from '../api/websocket';
import ReminderCard from './ReminderCard';
import ReminderDialog from './ReminderDialog';
import ViewReminderDialog from './ViewReminderDialog';

export default function Dashboard({ onLogout }) {
  const [reminders, setReminders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [viewingReminder, setViewingReminder] = useState(null);
  const [filters, setFilters] = useState({
    keyword: '',
    priority: '',
    status: '',
    reminderFrom: '',
    reminderTo: ''
  });
  
  // Real-time notification state
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchReminders();
    
    // Safely request notification permission
    try {
      if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().catch(err => console.log('Notification permission request ignored or blocked:', err));
      }
    } catch (err) {
      console.log('Notification API not fully supported:', err);
    }

    // Connect to WebSocket
    wsService.connect((msg) => {
      // Set a meaningful notification message based on the NotificationResponse DTO
      const title = `Reminder: ${msg.title || 'You have a new notification'}`;
      setNotification(title);

      // Trigger OS-level (Windows) notification
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body: msg.description || 'It is time for your reminder!',
            requireInteraction: true
          });
        } catch (err) {
          console.error("OS Notification error:", err);
        }
      }

      // Refresh the list just in case
      fetchReminders();
    });

    return () => {
      wsService.disconnect();
    };
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchReminders(filters);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters]);

  const fetchReminders = async (currentFilters = filters) => {
    try {
      const apiFilters = { ...currentFilters };
      
      const formatToFakeUTC = (dateStr) => {
        if (!dateStr) return dateStr;
        if (dateStr.length === 16) return `${dateStr}:00Z`;
        if (dateStr.length === 19) return `${dateStr}Z`;
        return dateStr;
      };

      if (apiFilters.reminderFrom) {
        apiFilters.reminderFrom = formatToFakeUTC(apiFilters.reminderFrom);
      }
      if (apiFilters.reminderTo) {
        apiFilters.reminderTo = formatToFakeUTC(apiFilters.reminderTo);
      }

      const res = await getReminders(0, 50, apiFilters);
      setReminders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch reminders', err);
    }
  };

  const handleCreate = () => {
    setEditingReminder(null);
    setDialogOpen(true);
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setDialogOpen(true);
  };

  const handleView = (reminder) => {
    setViewingReminder(reminder);
  };

  const handleDelete = async (id) => {
    try {
      await deleteReminder(id);
      fetchReminders();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleDialogClose = (refresh) => {
    setDialogOpen(false);
    if (refresh) fetchReminders();
  };

  return (
    <Box className="min-h-screen bg-gray-50">
      <AppBar position="static" color="transparent" elevation={0} className="bg-white border-b border-gray-200">
        <Toolbar className="flex justify-between">
          <Typography variant="h6" className="font-bold text-gray-800">
            NotifiQ Dashboard
          </Typography>
          <Button variant="outlined" color="error" onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container className="py-8">
        <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Typography variant="h4" className="text-gray-800 font-bold">
            Your Reminders
          </Typography>
          <Box className="flex gap-4 w-full sm:w-auto">
            <Button variant="contained" color="primary" onClick={handleCreate} className="w-full sm:w-auto" sx={{ width: { xs: '100%', sm: 'auto' } }}>
              Add Reminder
            </Button>
          </Box>
        </Box>

        <Box className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 glass">
          <Typography variant="subtitle2" className="text-gray-600 mb-3 font-semibold">Filter Reminders</Typography>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <TextField
              className="col-span-2 md:col-span-1"
              size="small"
              label="Search keyword"
              value={filters.keyword}
              onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
            />
            <TextField
              className="col-span-1"
              select
              size="small"
              label="Priority"
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="LOW">Low</MenuItem>
              <MenuItem value="MEDIUM">Medium</MenuItem>
              <MenuItem value="HIGH">High</MenuItem>
            </TextField>
            <TextField
              className="col-span-1"
              select
              size="small"
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
            </TextField>
            <TextField
              className="col-span-1"
              type="datetime-local"
              size="small"
              label="From"
              slotProps={{ inputLabel: { shrink: true } }}
              value={filters.reminderFrom}
              onChange={(e) => setFilters(prev => ({ ...prev, reminderFrom: e.target.value }))}
            />
            <TextField
              className="col-span-1"
              type="datetime-local"
              size="small"
              label="To"
              slotProps={{ inputLabel: { shrink: true } }}
              value={filters.reminderTo}
              onChange={(e) => setFilters(prev => ({ ...prev, reminderTo: e.target.value }))}
            />
          </div>
        </Box>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reminders.map((reminder, idx) => (
            <div key={reminder.reminderId || idx}>
              <ReminderCard 
                reminder={reminder} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
                onView={handleView}
              />
            </div>
          ))}
          {reminders.length === 0 && (
            <div className="col-span-1 sm:col-span-2 md:col-span-3">
              <Box className="text-center py-12 text-gray-500">
                <Typography variant="h6">No reminders found.</Typography>
                <Typography>Create one to get started!</Typography>
              </Box>
            </div>
          )}
        </div>
      </Container>

      <ReminderDialog 
        open={dialogOpen} 
        onClose={handleDialogClose} 
        reminderToEdit={editingReminder} 
      />

      <ViewReminderDialog
        open={!!viewingReminder}
        onClose={() => setViewingReminder(null)}
        reminder={viewingReminder}
      />

      <Snackbar 
        open={!!notification} 
        autoHideDuration={6000} 
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setNotification(null)} severity="info" sx={{ width: '100%' }}>
          {notification}
        </Alert>
      </Snackbar>
    </Box>
  );
}

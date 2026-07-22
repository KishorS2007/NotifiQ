import React, { useState, useEffect, useRef } from 'react';
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
  MenuItem,
  Avatar,
  IconButton,
  Menu,
  Badge
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getReminders, deleteReminder, getReminderById, getUnreadNotifications, markNotificationRead, getNotificationById, markAllNotificationsRead } from '../api/client';
import { wsService } from '../api/websocket';
import ReminderCard from './ReminderCard';
import ReminderDialog from './ReminderDialog';
import ViewReminderDialog from './ViewReminderDialog';
import ViewNotificationDialog from './ViewNotificationDialog';

export default function Dashboard({ onLogout }) {
  const [reminders, setReminders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const editingReminderRef = useRef(editingReminder);
  useEffect(() => { editingReminderRef.current = editingReminder; }, [editingReminder]);

  const [viewingReminder, setViewingReminder] = useState(null);
  const viewingReminderRef = useRef(viewingReminder);
  useEffect(() => { viewingReminderRef.current = viewingReminder; }, [viewingReminder]);
  const [filters, setFilters] = useState({
    keyword: '',
    priority: '',
    status: '',
    reminderFrom: '',
    reminderTo: ''
  });
  
  // Real-time notification state
  const [notification, setNotification] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState(null);
  const [viewingNotification, setViewingNotification] = useState(null);

  // Profile menu state
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const getFirstNameFromToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return 'User';
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      if (payload.fullName) {
        return payload.fullName.split(' ')[0];
      }
      if (payload.username) {
        return payload.username.split(' ')[0];
      }
      // Fallback to email username if fullName isn't provided by backend yet
      if (payload.sub) {
        return payload.sub.split('@')[0];
      }
    } catch (e) {
      console.error("Failed to parse token", e);
    }
    return 'User';
  };

  const firstName = getFirstNameFromToken();

  useEffect(() => {
    fetchReminders();
    fetchUnreadNotifications();
    
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
      // Set the full msg in state so we can add a View button to the Snackbar
      setNotification(msg);
      
      setUnreadNotifications(prev => [msg, ...prev]);
      
      const currentEditing = editingReminderRef.current;
      if (currentEditing && currentEditing.reminderId === msg.reminderId && currentEditing.repeatUnit === 'NONE') {
        setDialogOpen(false);
        setEditingReminder(null);
      }
      
      const currentViewing = viewingReminderRef.current;
      if (currentViewing && currentViewing.reminderId === msg.reminderId && currentViewing.repeatUnit === 'NONE') {
        setViewingReminder(null);
      }

      const title = `Reminder: ${msg.title || 'You have a new notification'}`;

      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          const osNotification = new Notification(title, {
            body: msg.description || 'It is time for your reminder!',
            requireInteraction: true
          });
          
          // Prevent garbage collection of the notification object
          window._activeNotifications = window._activeNotifications || [];
          window._activeNotifications.push(osNotification);

          const handleClick = function(event) {
            if (event) event.preventDefault(); 
            window.focus();
            osNotification.close();
            
            console.log("Notification clicked. Message:", msg);
            if (msg.notificationId) {
              handleNotificationClick(msg);
            } else {
              console.warn("Notification did not contain a notificationId");
            }
          };

          osNotification.onclick = handleClick;
          osNotification.addEventListener('click', handleClick);
          
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

  const fetchUnreadNotifications = async () => {
    try {
      const res = await getUnreadNotifications();
      setUnreadNotifications(res.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      setNotificationMenuAnchor(null);
      await markNotificationRead(notif.notificationId);
      const res = await getNotificationById(notif.notificationId);
      setViewingNotification(res.data);
      fetchUnreadNotifications(); // Refresh list to remove the read one
    } catch (err) {
      console.error('Failed to open notification', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setUnreadNotifications([]);
      setNotificationMenuAnchor(null);
    } catch (err) {
      console.error('Failed to mark all as read', err);
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
          <Box className="flex items-center">
            <Typography variant="body1" className="text-gray-700 mr-2 font-medium">
              Hi {firstName}, welcome back
            </Typography>
            <IconButton onClick={(e) => setNotificationMenuAnchor(e.currentTarget)} size="small" sx={{ ml: 1, mr: 1 }}>
              <Badge badgeContent={unreadNotifications.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={(e) => setProfileAnchorEl(e.currentTarget)} size="small">
              <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                {firstName.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={notificationMenuAnchor}
              open={Boolean(notificationMenuAnchor)}
              onClose={() => setNotificationMenuAnchor(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{ paper: { style: { maxHeight: 400, width: '35ch' } } }}
            >
              <Box className="flex justify-between items-center" sx={{ px: 2, py: 1, borderBottom: '1px solid #eee', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Notifications</Typography>
                {unreadNotifications.length > 0 && (
                  <Button size="small" onClick={handleMarkAllRead} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>Mark all read</Button>
                )}
              </Box>
              {unreadNotifications.length === 0 ? (
                <MenuItem disabled>No unread notifications</MenuItem>
              ) : (
                unreadNotifications.map(notif => (
                  <MenuItem key={notif.notificationId} onClick={() => handleNotificationClick(notif)}>
                    <Box className="flex flex-col w-full">
                      <Typography variant="body2" fontWeight="bold" noWrap>{notif.title}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>{notif.description}</Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Menu>
            <Menu
              anchorEl={profileAnchorEl}
              open={Boolean(profileAnchorEl)}
              onClose={() => setProfileAnchorEl(null)}
              onClick={() => setProfileAnchorEl(null)}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={onLogout}>
                <Typography color="error">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
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
        onEdit={(r) => {
          setViewingReminder(null);
          handleEdit(r);
        }}
        onDelete={(id) => {
          setViewingReminder(null);
          handleDelete(id);
        }}
      />

      <ViewNotificationDialog
        open={!!viewingNotification}
        onClose={() => setViewingNotification(null)}
        notification={viewingNotification}
        onViewReminder={async (reminderId) => {
          try {
             setViewingNotification(null);
             const res = await getReminderById(reminderId);
             setViewingReminder(res.data);
          } catch(e) {
             console.error("Could not fetch reminder details:", e);
             alert("Failed to load schedule. It may have been deleted.");
          }
        }}
      />

      <Snackbar 
        open={!!notification} 
        autoHideDuration={6000} 
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification(null)} 
          severity="info" 
          sx={{ width: '100%' }}
          action={
            <Button color="inherit" size="small" onClick={() => {
              // Handle both new object state and old string state (fallback for HMR)
              const notifId = typeof notification === 'object' && notification !== null ? notification.notificationId : null;
              if (notifId) {
                markNotificationRead(notifId).then(() => {
                  getNotificationById(notifId).then(res => {
                    setViewingNotification(res.data);
                    setNotification(null);
                    fetchUnreadNotifications();
                  }).catch(err => {
                    console.error("VIEW button failed to fetch notification:", err);
                    alert("Failed to load notification details!");
                  });
                });
              } else {
                alert("Please refresh the page to apply the latest updates!");
              }
            }}>
              VIEW
            </Button>
          }
        >
          {typeof notification === 'object' && notification !== null 
            ? `Reminder: ${notification.title || ''}` 
            : typeof notification === 'string' ? notification : ''}
        </Alert>
      </Snackbar>
    </Box>
  );
}

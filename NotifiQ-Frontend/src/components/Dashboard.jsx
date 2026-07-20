import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button,
  AppBar,
  Toolbar,
  Snackbar,
  Alert
} from '@mui/material';
import { getReminders, deleteReminder } from '../api/client';
import { wsService } from '../api/websocket';
import ReminderCard from './ReminderCard';
import ReminderDialog from './ReminderDialog';

export default function Dashboard({ onLogout }) {
  const [reminders, setReminders] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  
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

  const fetchReminders = async () => {
    try {
      const res = await getReminders(0, 50);
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
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="text-gray-800 font-bold">
            Your Reminders
          </Typography>
          <Box className="flex gap-4">
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={() => {
                console.log("Test Notification clicked");
                if (!('Notification' in window)) {
                  alert("This browser does not support desktop notifications.");
                  return;
                }
                console.log("Current permission:", Notification.permission);
                
                if (Notification.permission === 'granted') {
                  try {
                    new Notification('Test Notification', { body: 'This is a test from NotifiQ!' });
                    console.log("Notification object created successfully.");
                  } catch (e) {
                    console.error("Error creating Notification:", e);
                    alert("Error creating notification. Check console.");
                  }
                } else {
                  console.log("Requesting permission...");
                  try {
                    Notification.requestPermission().then(permission => {
                      console.log("Permission result:", permission);
                      if (permission === 'granted') {
                        new Notification('Permission Granted', { body: 'Notifications are now enabled!' });
                      } else {
                        alert('Notification permission was denied. Please click the padlock icon next to your URL bar and allow notifications.');
                      }
                    }).catch(err => {
                      console.error("requestPermission promise rejected:", err);
                      alert("Error requesting permission.");
                    });
                  } catch (err) {
                    console.error("requestPermission threw an error:", err);
                    alert("Your browser does not support promise-based requestPermission.");
                  }
                }
              }}
            >
              Test Notification
            </Button>
            <Button variant="contained" color="primary" onClick={handleCreate}>
              Add Reminder
            </Button>
          </Box>
        </Box>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {reminders.map((reminder, idx) => (
            <div key={reminder.reminderId || idx}>
              <ReminderCard 
                reminder={reminder} 
                onEdit={handleEdit} 
                onDelete={handleDelete} 
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

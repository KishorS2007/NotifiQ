import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Alert,
  Box
} from '@mui/material';
import { createReminder, updateReminder } from '../api/client';

export default function ReminderDialog({ open, onClose, reminderToEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    remindAt: '',
    repeatInterval: '',
    repeatUnit: 'NONE',
    priority: 'MEDIUM',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setError('');
      if (reminderToEdit) {
        // format date for local datetime-local input without shifting to UTC
        const dateObj = new Date(reminderToEdit.remindAt);
        const tzOffset = dateObj.getTimezoneOffset() * 60000; // offset in milliseconds
        const localISOTime = new Date(dateObj - tzOffset).toISOString().slice(0, 16); // YYYY-MM-DDThh:mm

        setFormData({
          title: reminderToEdit.title || '',
          description: reminderToEdit.description || '',
          remindAt: localISOTime,
          repeatInterval: reminderToEdit.repeatInterval || '',
          repeatUnit: reminderToEdit.repeatUnit || 'NONE',
          priority: reminderToEdit.priority || 'MEDIUM',
        });
      } else {
        const nextMinute = new Date(Date.now() + 60000);
        const tzOffset = nextMinute.getTimezoneOffset() * 60000;
        const localNextMinute = new Date(nextMinute - tzOffset).toISOString().slice(0, 16);

        setFormData({
          title: '',
          description: '',
          remindAt: localNextMinute,
          repeatInterval: '',
          repeatUnit: 'NONE',
          priority: 'MEDIUM',
        });
      }
    }
  }, [open, reminderToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const payload = { ...formData };
      
      // format datetime for Spring Boot LocalDateTime (yyyy-MM-dd'T'HH:mm:ss)
      if (payload.remindAt) {
        payload.remindAt = payload.remindAt.length === 16 ? `${payload.remindAt}:00` : payload.remindAt;
      }

      if (!payload.repeatInterval || payload.repeatUnit === 'NONE') {
        payload.repeatInterval = null;
        payload.repeatUnit = "NONE";
      } else {
        payload.repeatInterval = parseInt(payload.repeatInterval, 10);
      }

      if (reminderToEdit) {
        await updateReminder(reminderToEdit.reminderId, payload);
      } else {
        await createReminder(payload);
      }
      onClose(true); // true means refresh needed
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        if (typeof data === 'string') {
          setError(data);
        } else if (data.message) {
          setError(data.message);
        } else if (typeof data === 'object') {
          // Parse Spring Boot's Map<String, String> field errors
          const errorMessages = Object.entries(data)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ');
          setError(errorMessages || 'Failed to save reminder');
        } else {
          setError('Failed to save reminder');
        }
      } else {
        setError('Failed to save reminder');
      }
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth disableRestoreFocus>
      <DialogTitle>{reminderToEdit ? 'Edit Reminder' : 'Create Reminder'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          {error && <Alert severity="error" className="mb-4">{error}</Alert>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <TextField
                label="Title"
                name="title"
                fullWidth
                required
                value={formData.title}
                onChange={handleChange}
                slotProps={{ htmlInput: { minLength: 1, maxLength: 200 } }}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <TextField
                label="Description"
                name="description"
                fullWidth
                required
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                slotProps={{ htmlInput: {minLength:1, maxLength: 500 } }}
              />
            </div>
            <div className="col-span-1 sm:col-span-2">
              <TextField
                label="Remind At"
                name="remindAt"
                type="datetime-local"
                fullWidth
                required
                slotProps={{ inputLabel: { shrink: true } }}
                value={formData.remindAt}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-1">
              <TextField
                select
                label="Priority"
                name="priority"
                fullWidth
                value={formData.priority}
                onChange={handleChange}
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </TextField>
            </div>
            <div className="col-span-1">
              <Box className="flex gap-2">
                <TextField
                  label="Interval"
                  name="repeatInterval"
                  type="number"
                  disabled={formData.repeatUnit === 'NONE'}
                  className="w-1/2"
                  value={formData.repeatInterval}
                  onChange={handleChange}
                  slotProps={{ htmlInput: { min: 1 } }}
                />
                <TextField
                  select
                  label="Unit"
                  name="repeatUnit"
                  className="w-1/2"
                  value={formData.repeatUnit}
                  onChange={handleChange}
                >
                  <MenuItem value="NONE">None</MenuItem>
                  <MenuItem value="MINUTE">Minutes</MenuItem>
                  <MenuItem value="HOUR">Hours</MenuItem>
                  <MenuItem value="DAY">Days</MenuItem>
                  <MenuItem value="WEEK">Weeks</MenuItem>
                  <MenuItem value="MONTH">Months</MenuItem>
                </TextField>
              </Box>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="p-4">
          <Button onClick={() => onClose(false)} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

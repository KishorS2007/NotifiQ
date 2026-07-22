import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip
} from '@mui/material';

export default function ViewNotificationDialog({ open, onClose, notification, onViewReminder }) {
  if (!notification) return null;

  const dateStr = new Date(notification.createdAt).toLocaleString();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'error';
      case 'MEDIUM': return 'warning';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth disableRestoreFocus>
      <DialogTitle className="flex justify-between items-center border-b border-gray-100 pb-3">
        <span className="font-bold text-gray-800 break-words">{notification.title}</span>
        <Box className="flex items-center gap-3 ml-4">
          <Chip 
            label={notification.priority || 'MEDIUM'} 
            size="small" 
            color={getPriorityColor(notification.priority)} 
          />
        </Box>
      </DialogTitle>
      <DialogContent className="pt-6">
        <Typography variant="body1" className="whitespace-pre-wrap text-gray-700 mb-6 mt-4">
          {notification.description}
        </Typography>

        <Box className="bg-gray-50 p-4 rounded-lg">
          <Typography variant="subtitle2" className="text-gray-600 mb-1">
            Triggered At
          </Typography>
          <Typography variant="body2" className="font-medium text-gray-900 mb-3">
            {dateStr}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions className="p-4 border-t border-gray-100 flex justify-between items-center w-full">
        <Box>
           <Button 
              onClick={() => onViewReminder(notification.reminderId)} 
              color="secondary" 
            >
              View Schedule
            </Button>
        </Box>
        <Button onClick={onClose} color="primary" variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

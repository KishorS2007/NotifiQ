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
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth 
      disableRestoreFocus
      slotProps={{
        paper: {
          className: 'light-glass rounded-2xl border border-white/20 shadow-xl'
        }
      }}
    >
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

        <Box className="bg-white/40 p-5 rounded-xl border border-white/50 shadow-inner">
          <Typography variant="subtitle2" className="text-gray-600 mb-1">
            Triggered At
          </Typography>
          <Typography variant="body2" className="font-medium text-gray-900 mb-3">
            {dateStr}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions className="px-8 py-5 border-t border-gray-100 flex justify-between items-center w-full">
        <Box>
           <Button 
              onClick={() => onViewReminder(notification.reminderId)} 
              className="text-blue-600 hover:bg-blue-50 font-medium"
            >
              View Schedule
            </Button>
        </Box>
        <Button onClick={onClose} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 !text-white shadow-md shadow-blue-500/20 rounded-xl px-6 py-1.5 font-bold transition-all" sx={{ color: 'white' }}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

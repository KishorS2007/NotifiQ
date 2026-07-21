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

export default function ViewReminderDialog({ open, onClose, reminder }) {
  if (!reminder) return null;

  const dateStr = new Date(reminder.remindAt).toLocaleString();

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
        <span className="font-bold text-gray-800 break-words">{reminder.title}</span>
        <Chip 
          label={reminder.priority || 'MEDIUM'} 
          size="small" 
          color={getPriorityColor(reminder.priority)} 
          className="ml-4"
        />
      </DialogTitle>
      <DialogContent className="pt-6">
        <Typography variant="body1" className="whitespace-pre-wrap text-gray-700 mb-6 mt-4">
          {reminder.description}
        </Typography>

        <Box className="bg-gray-50 p-4 rounded-lg">
          <Typography variant="subtitle2" className="text-gray-600 mb-1">
            Scheduled Time
          </Typography>
          <Typography variant="body2" className="font-medium text-gray-900 mb-3">
            {dateStr}
          </Typography>

          {reminder.repeatInterval && reminder.repeatUnit !== "NONE" && (
            <>
              <Typography variant="subtitle2" className="text-gray-600 mb-1">
                Repetition
              </Typography>
              <Typography variant="body2" className="font-medium text-gray-900">
                Repeats every {reminder.repeatInterval} {reminder.repeatUnit.toLowerCase()}(s)
              </Typography>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions className="p-4 border-t border-gray-100">
        <Button onClick={onClose} color="primary" variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

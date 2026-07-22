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

export default function ViewReminderDialog({ open, onClose, reminder, onEdit, onDelete }) {
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
        <Box className="flex items-center gap-3 ml-4">
          {reminder.status === 'COMPLETED' && (
            <span className="flex items-center text-green-600 font-bold text-sm tracking-wide bg-green-50 px-2 py-1 rounded">
              <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              COMPLETED
            </span>
          )}
          <Chip 
            label={reminder.priority || 'MEDIUM'} 
            size="small" 
            color={getPriorityColor(reminder.priority)} 
          />
        </Box>
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
      <DialogActions className="p-4 border-t border-gray-100 flex justify-between items-center w-full">
        <Box>
          {reminder.status !== 'COMPLETED' && (
            <Button 
              onClick={() => onEdit(reminder)} 
              color="primary" 
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
          )}
          <Button 
            onClick={() => onDelete(reminder.reminderId)} 
            color="error"
          >
            Delete
          </Button>
        </Box>
        <Button onClick={onClose} color="primary" variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

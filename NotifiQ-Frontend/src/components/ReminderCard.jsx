import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Chip } from '@mui/material';

export default function ReminderCard({ reminder, onEdit, onDelete, onView }) {
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
    <Card 
      className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col glass cursor-pointer"
      onClick={() => onView && onView(reminder)}
    >
      <CardContent className="flex flex-col flex-grow">
        <Box className="flex justify-between items-start mb-2">
          <Typography variant="h6" className="font-bold text-gray-800 line-clamp-1">
            {reminder.title}
          </Typography>
          <Chip 
            label={reminder.priority || 'MEDIUM'} 
            size="small" 
            color={getPriorityColor(reminder.priority)} 
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" className="mb-4 flex-grow line-clamp-3">
          {reminder.description}
        </Typography>
        
        <Box className="mt-auto">
          <Typography variant="caption" className="font-semibold text-gray-600 block mb-2">
            Time: {dateStr}
          </Typography>
          {reminder.repeatInterval && reminder.repeatUnit != "NONE" && (
            <Typography variant="caption" className="text-gray-500 block mb-2">
              Repeats every {reminder.repeatInterval} {reminder.repeatUnit}
            </Typography>
          )}
          
          <Box className="flex gap-2 justify-end mt-2 pt-2 border-t border-gray-100">
            <button 
              className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(reminder);
              }}
            >
              Edit
            </button>
            <button 
              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(reminder.reminderId);
              }}
            >
              Delete
            </button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

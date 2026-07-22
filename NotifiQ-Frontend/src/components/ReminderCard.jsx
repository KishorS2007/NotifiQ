import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, Chip } from '@mui/material';

export default function ReminderCard({ reminder, onView }) {
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
          <Typography variant="h6" className="font-bold text-gray-800 line-clamp-1 mt-1">
            {reminder.title}
          </Typography>
          <Box className="flex flex-col items-end gap-1 shrink-0 ml-2">
            <Chip 
              label={reminder.priority || 'MEDIUM'} 
              size="small" 
              color={getPriorityColor(reminder.priority)} 
            />
            {reminder.status === 'COMPLETED' && (
              <span className="flex items-center text-green-600 font-bold text-[11px] tracking-wide">
                <svg className="w-3 h-3 mr-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                COMPLETED
              </span>
            )}
          </Box>
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
          

        </Box>
      </CardContent>
    </Card>
  );
}

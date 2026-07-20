import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { login, register } from '../api/client';

export default function AuthForm({ onAuthSuccess }) {
  const [tab, setTab] = useState(0);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (tab === 0) {
        // Login
        const res = await login(email, password);
        localStorage.setItem('token', res.data.token);
        onAuthSuccess();
      } else {
        // Register
        const res = await register(userName, email, password);
        // Assuming register auto-logs in or at least succeeds
        setTab(0);
        setError('Registration successful! Please login.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <Box className="flex justify-center items-center h-screen bg-gray-50">
      <Card className="w-96 shadow-lg">
        <CardContent>
          <Typography variant="h5" className="text-center mb-4 font-bold text-gray-800">
            NotifiQ
          </Typography>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} variant="fullWidth" className="mb-4">
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          
          {error && <Alert severity={error.includes('success') ? 'success' : 'error'} className="mb-4">{error}</Alert>}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tab === 1 && (
              <TextField
                label="Username"
                type="text"
                variant="outlined"
                fullWidth
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            )}
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />
            <Button variant="contained" color="primary" type="submit" size="large">
              {tab === 0 ? 'Login' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

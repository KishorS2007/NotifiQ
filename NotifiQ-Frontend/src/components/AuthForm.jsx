import React, { useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MailIcon from '@mui/icons-material/MailOutlined';
import LockIcon from '@mui/icons-material/LockOutlined';
import PersonIcon from '@mui/icons-material/PersonOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { login, register } from '../api/client';
import logoImage from '../assets/logo.png';

export default function AuthForm({ onAuthSuccess }) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Signup State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const extractErrorMessage = (err, defaultMsg) => {
    console.error("Auth error:", err, err.response);
    
    if (!err.response) {
      return err.message || defaultMsg;
    }
    
    const data = err.response.data;
    if (data) {
      if (typeof data === 'string' && data.trim() !== '') {
        return data;
      }
      if (data.message) {
        return data.message;
      }
      if (typeof data === 'object') {
        const errorValues = Object.values(data).filter(val => typeof val === 'string');
        if (errorValues.length > 0) {
          return errorValues.join(' • ');
        }
      }
    }
    return defaultMsg;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(loginEmail, loginPassword);
      localStorage.setItem('token', res.data.token);
      onAuthSuccess();
    } catch (err) {
      if (err.response?.status === 400) {
        setError('Invalid email or password');
      } else {
        setError(extractErrorMessage(err, 'Authentication failed'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    setLoading(true);
    try {
      await register(signupName, signupEmail, signupPassword);
      setSuccessMsg('Account created! Please log in.');
      setIsFlipped(false);
      // clear signup fields
      setSignupName('');
      setSignupEmail('');
      setSignupPassword('');
    } catch (err) {
      setError(extractErrorMessage(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };
  
  const toggleFlip = () => {
    setIsFlipped(!isFlipped);
    setError('');
    setSuccessMsg('');
  };

  const inputClasses = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all duration-300";

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setError('');
    setSuccessMsg('');
  };

  return (
    <>
      <div className="royal-bg"></div>
      <Box className="flex justify-center items-center min-h-screen p-4">
        
        {/* 3D Scene Wrapper */}
        <div className="perspective-1000 w-full max-w-[400px] h-[480px] sm:h-[540px]">
          
          {/* Inner 3D Container */}
          <div className={`relative w-full h-full preserve-3d transition-transform duration-700 ease-in-out ${isFlipped ? 'rotate-y-180' : ''}`}>
            
            {/* FRONT SIDE (LOGIN) */}
            <div className="absolute inset-0 backface-hidden light-glass rounded-[2rem] p-5 sm:p-8 flex flex-col">
              <div className="flex-grow flex flex-col">
                <div className="flex flex-col items-center justify-center mb-1 mt-0">
                  <img src={logoImage} alt="NotifiQ Logo" className="h-10 sm:h-14 object-contain drop-shadow-md" />
                </div>
                <Typography variant="h5" className="text-center font-bold text-slate-800 mb-1">
                  Welcome Back 
                </Typography>
                <Typography variant="body2" className="text-center text-slate-500 mb-2">
                  Sign in to continue to your account
                </Typography>

                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3 mt-16">
                  <div>
                    <Typography variant="caption" className="text-slate-600 mb-1 block font-medium">Email</Typography>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MailIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </div>
                      <input 
                        type="email" 
                        required
                        className={`${inputClasses} pl-10`}
                        placeholder="Enter your email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Typography variant="caption" className="text-slate-600 mb-1 block font-medium">Password</Typography>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockIcon sx={{ color: '#94a3b8', fontSize: 20 }} />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        className={`${inputClasses} pl-10 pr-10`}
                        placeholder="Enter your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-1 flex items-center">
                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff sx={{ color: '#94a3b8', fontSize: 20 }}/> : <Visibility sx={{ color: '#94a3b8', fontSize: 20 }}/>}
                        </IconButton>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50"
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : (
                      <>Login <ArrowForwardIcon fontSize="small" /></>
                    )}
                  </button>
                </form>
              </div>

              <div className="pt-6 border-t border-slate-200 text-center mt-4">
                <Typography variant="body2" className="text-slate-500">
                  Don't have an account?{' '}
                  <button type="button" onClick={toggleFlip} className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                    Sign Up &rarr;
                  </button>
                </Typography>
              </div>
            </div>

            {/* BACK SIDE (SIGNUP) */}
            <div className="absolute inset-0 backface-hidden light-glass rounded-[2rem] p-5 sm:p-8 flex flex-col rotate-y-180">
              <div className="flex-grow flex flex-col">
                <div className="flex flex-col items-center justify-center mb-2 mt-1">
                  <img src={logoImage} alt="NotifiQ Logo" className="h-14 sm:h-16 object-contain drop-shadow-md" />
                </div>
                <Typography variant="h6" className="text-center font-bold text-slate-800 mb-1">
                  Create Account
                </Typography>
                <Typography variant="caption" className="text-center text-slate-500 mb-2 block">
                  Join us and get started
                </Typography>

                <form onSubmit={handleSignupSubmit} className="flex flex-col gap-3 mt-4">
                  <div>
                    <Typography variant="caption" className="text-slate-600 mb-1 block text-xs font-medium">Full Name</Typography>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PersonIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                      </div>
                      <input 
                        type="text" 
                        required
                        className={`${inputClasses} py-2 pl-9 text-sm`}
                        placeholder="Enter your full name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Typography variant="caption" className="text-slate-600 mb-1 block text-xs font-medium">Email</Typography>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MailIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                      </div>
                      <input 
                        type="email" 
                        required
                        className={`${inputClasses} py-2 pl-9 text-sm`}
                        placeholder="Enter your email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Typography variant="caption" className="text-slate-600 mb-1 block text-xs font-medium">Password</Typography>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockIcon sx={{ color: '#94a3b8', fontSize: 18 }} />
                      </div>
                      <input 
                        type={showPassword ? "text" : "password"}
                        required
                        className={`${inputClasses} py-2 pl-9 pr-9 text-sm`}
                        placeholder="Create a password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 pr-1 flex items-center">
                        <IconButton size="small" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff sx={{ color: '#94a3b8', fontSize: 16 }}/> : <Visibility sx={{ color: '#94a3b8', fontSize: 16 }}/>}
                        </IconButton>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={loading}
                    className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 transition-all duration-300 flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50"
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : (
                      <>Create Account <ArrowForwardIcon fontSize="small" /></>
                    )}
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-slate-200 text-center mt-2">
                <Typography variant="body2" className="text-slate-500 text-xs">
                  Already have an account?{' '}
                  <button type="button" onClick={toggleFlip} className="text-blue-600 hover:text-blue-700 font-bold transition-colors">
                    Login &rarr;
                  </button>
                </Typography>
              </div>
            </div>

          </div>
        </div>
      </Box>

      <Snackbar 
        open={!!error || !!successMsg} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%', borderRadius: '12px' }}
          variant="filled"
        >
          {error || successMsg}
        </Alert>
      </Snackbar>
    </>
  );
}

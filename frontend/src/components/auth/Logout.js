// auth/Logout.js
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { Button, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router';
const Logout = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate()
  const handleLogout = () => {
    logout();
    // Redirect or show a message that the user is logged out
    navigate('/');
  };

  return (
    <div>
      <Paper elevation={6} style={{ padding: '20px', maxWidth: '300px', margin: '30vh auto' }}>
        <Typography variant="h5" align="center" justifyContent={'center'} gutterBottom>
          Logout
        </Typography>
        <Button variant="contained" color="secondary" fullWidth onClick={handleLogout}>
          Logout
        </Button>
      </Paper>
    </div>
  );
};

export default Logout;

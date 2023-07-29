import React, { useContext, useState } from 'react';
import { AuthContext } from './AuthContext';
import { TextField, Button, Paper, Typography, Box, Grid, Snackbar, SnackbarContent } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success' or 'error'
  const navigate = useNavigate();

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      setSnackbarSeverity('success');
      setSnackbarMessage('Login successful!');
      setOpenSnackbar(true);

      // Navigate to the home page after successful login
      navigate('/home');
    } else {
      setSnackbarSeverity('error');
      setSnackbarMessage('Invalid credentials. Please try again.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Grid container justifyContent="center" alignItems="center" style={{ height: '100vh' }}>
      <Box component={Paper} elevation={3} p={4} maxWidth="300px">
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }} // Set anchor position to top right
      >
        <SnackbarContent
          style={{
            backgroundColor: snackbarSeverity === 'success' ? 'green' : 'red',
            boxShadow: 'none', // Remove the extra background layer
          }}
          message={
            <MuiAlert
              elevation={6}
              variant="filled"
              onClose={handleSnackbarClose}
              severity={snackbarSeverity}
            >
              {snackbarMessage}
            </MuiAlert>
          }
        />
      </Snackbar>
    </Grid>
  );
};

export default Login;

import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, Snackbar, Alert } from '@mui/material';
import LazyImage from './lazyImage';
import config from '../config';
import SearchIcon from '@mui/icons-material/Search';
const DeleteProduct = () => {
  const [productCode, setProductCode] = useState('');
  const [productDetails, setProductDetails] = useState({});
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');
  const handleFetchProduct = async (e) => {
    e.preventDefault();

    // Check if the product code is provided
    if (!productCode.trim()) {
      setSnackbarMessage('Please provide a product code.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/getProductByCode?code=${productCode}`);
      const data = await response.json();
      if (response.ok) {
        setProductDetails(data);
        setShowProductDetails(true);
      } else {
        setProductDetails(null);
        setSnackbarMessage('Product not found.');
        setShowProductDetails(false);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProductDetails(null);
      setSnackbarMessage('Something went wrong. Please try again later.');
      setShowProductDetails(false);
      setSnackbarOpen(true);
    }
  };

  const handleDeleteProduct = async (e) => {
    e.preventDefault();

    // Check if the product code is provided
    if (!productCode.trim()) {
      setSnackbarMessage('Please provide a product code.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(`${config.apiBaseUrl}/deleteProduct?code=${productCode}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        setProductCode('');
        setProductDetails(null);
        setShowProductDetails(false);
        setSnackbarMessage('Product deleted successfully.');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage('Error deleting product: ' + data.error);
        setShowProductDetails(false);
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setSnackbarMessage('Something went wrong. Please try again later.');
      setShowProductDetails(false);
      setSnackbarOpen(true);
    }
  };

  const handleProductCodeChange = (e) => {
    setProductCode(e.target.value);
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Box mt={3}>
        <Typography variant='h4' align='center' gutterBottom>
          Delete Product
        </Typography>
        <form onSubmit={handleFetchProduct}>
          <TextField
            fullWidth
            label="Product Code"
            variant="outlined"
            value={productCode}
            onChange={handleProductCodeChange}
            margin="normal"
            required
          // Custom validation for required field
          // error={!productCode.trim() && !!errorMessage}
          // helperText={!productCode.trim() && !!errorMessage ? errorMessage : ''}
          />
          <Button type="submit" variant="contained" color="primary" startIcon={<SearchIcon/>}>
            Fetch Product Details
          </Button>
        </form>
        {showProductDetails && productDetails && (
          <div>
            <h2>Product Details</h2>
            <LazyImage
              src={`${config.apiBaseUrl}/getProductImage?code=${productDetails.code}`} // Use the "data" URL to display the image
              alt={productDetails.name}
              style={{ maxWidth: '300px', }}
              label={'image loading.....'}
            />
            <p>Code: {productDetails.code}</p>
            <p>Name: {productDetails.name}</p>
            <p>Size: {productDetails.size}</p>
            <p>Amount: {productDetails.amount}</p>
            <Button type="button" variant="contained" color="secondary" onClick={handleDeleteProduct} >
              Delete Product
            </Button>
          </div>
        )}
      </Box>
      {/* Snackbar component to show alerts */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DeleteProduct;

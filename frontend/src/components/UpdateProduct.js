import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Snackbar, Alert, Typography } from '@mui/material';
import config from '../config';
import LazyImage from './lazyImage';
import SearchIcon from '@mui/icons-material/Search';
const UpdateProduct = () => {
  const [productCode, setProductCode] = useState('');
  const [productDetails, setProductDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false); // Track if the product is updated
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [hideImage, setHideImage] = useState(false);
  const handleImageChange = async (e) => {
    setHideImage(!hideImage);
  };
  // Function to refresh the page
  const refreshPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (isUpdateSuccessful) {
      // If the update is successful, refresh the page after a short delay
      const timer = setTimeout(() => {
        setSnackbarMessage('Product updated successfully.');
        setSnackbarOpen(true);
        refreshPage();
      }, 3000);

      // Clear the timer to avoid unnecessary refreshes
      return () => clearTimeout(timer);
    }
  }, [isUpdateSuccessful]);
  const handleFetchProduct = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${config.apiBaseUrl}/getProductsByCode?code=${productCode}`);
      const responseBody = await response.text(); // Get the response body as text

      console.log('Response body:', responseBody); // Log the response body

      if (response.ok) {
        const data = JSON.parse(responseBody); // Try to parse the response body as JSON

        setProductDetails(data);
        setErrorMessage(null);
      } else {
        setProductDetails(null);
        setSnackbarMessage('Product not found.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProductDetails(null);
      setSnackbarMessage('Error updating product. Please try again later.');
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append('name', productDetails.name);
      formData.append('size', productDetails.size);
      formData.append('amount', productDetails.amount);
      // Append the image file only if it's present
      if (productDetails.image) {
        const base64Image = await getBase64Image(productDetails.image);
        formData.append('image', base64Image);
        // formData.append('image', productDetails.image);
      }

      const response = await fetch(`${config.apiBaseUrl}/updateProduct?code=${productCode}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        setIsUpdated(true);
        setErrorMessage(null);
        const data = await response.json();

        // Check if the server returned a new imageURL and update the productDetails state
        if (data.imageURL) {
          setProductDetails({ ...productDetails, imageURL: data.imageURL });
        }
      } else {
        const data = await response.json();
        // setErrorMessage('Error updating product: ' + data.error);
        setSnackbarMessage('Error updating product: ' + data.error);
      }
      setIsUpdateSuccessful(true);
    } catch (error) {
      console.error('Error updating product:', error);
      // setErrorMessage('Something went wrong. Please try again later.');
      setSnackbarMessage('Something went wrong. Please try again later.');
    }
  };

  const getBase64Image = (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result.split(',')[1]);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(image);
    });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={3}>
        <Typography variant='h4' align='center' gutterBottom>
          Update Product Details
        </Typography>
        <form onSubmit={handleFetchProduct}>
          <TextField
            fullWidth
            label="Product Code"
            variant="outlined"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            margin="normal"
            required
          />
          <Button type="submit" variant="contained" color="primary" startIcon={<SearchIcon />}>
            Fetch Product Details
          </Button>
        </form>
        {productDetails && (
          <div>
            <h2>Product Details</h2>
            <form onSubmit={handleUpdateProduct}>
              <TextField
                fullWidth
                label="Product Name"
                variant="outlined"
                value={productDetails.name}
                onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Product Size"
                variant="outlined"
                value={productDetails.size}
                onChange={(e) => setProductDetails({ ...productDetails, size: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Product Amount"
                variant="outlined"
                value={productDetails.amount}
                onChange={(e) => setProductDetails({ ...productDetails, amount: e.target.value })}
                margin="normal"
                required
              />
              <div>
                {hideImage ? null : (

                  <LazyImage
                    src={`${config.apiBaseUrl}/getProductImage?code=${productDetails.code}`} // Use the "imageURL" property, not "image"
                    alt={productDetails.name}
                    style={{ maxWidth: '100px', boxShadow: '0px 0px 10px grey', borderRadius: '0.7rem' }}
                  />
                )}
              </div>
              <TextField
                fullWidth
                label="Change Product Image"
                variant="outlined"
                type="file"
                onClick={handleImageChange}
                onChange={(e) => setProductDetails({ ...productDetails, image: e.target.files[0] })}
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              {/* Add more fields for other product details */}

              <Button type="submit" variant="contained" color="primary">
                Update Product
              </Button>
            </form>
          </div>
        )}
        {errorMessage && (
          <div
            style={{
              margin: '20px 0',
              padding: '10px',
              backgroundColor: 'red',
              color: 'white',
              textAlign: 'center',
            }}
          >
            {errorMessage}
          </div>
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        style={{ margin: '20px 0' }}
      >
        <Alert onClose={handleSnackbarClose} severity={isUpdateSuccessful ? 'success' : 'error'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UpdateProduct;

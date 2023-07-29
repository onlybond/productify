import React, { useState } from 'react';
import { TextField, Button, Container, Box,Typography } from '@mui/material';

const DeleteProduct = () => {
  const [productCode, setProductCode] = useState('');
  const [productDetails, setProductDetails] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);

  const handleFetchProduct = async (e) => {
    e.preventDefault();

    // Check if the product code is provided
    if (!productCode.trim()) {
      setErrorMessage('Please provide a product code.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productCode}`);
      const data = await response.json();
      if (response.ok) {
        if (productDetails.image) {
          // Convert the binary image data to a URL
          const imageURL = URL.createObjectURL(new Blob([productDetails.image]));
          setProductDetails({ ...productDetails, imageURL }); // Update productDetails with the imageURL
        }
        setProductDetails(data);
        setErrorMessage(null);
        setShowProductDetails(true);
      } else {
        setProductDetails(null);
        setErrorMessage('Product not found.');
        setShowProductDetails(false);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProductDetails(null);
      setErrorMessage('Something went wrong. Please try again later.');
      setShowProductDetails(false);
    }
  };

  const handleDeleteProduct = async (e) => {
    e.preventDefault();

    // Check if the product code is provided
    if (!productCode.trim()) {
      setErrorMessage('Please provide a product code.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${productCode}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (response.ok) {
        setProductCode('');
        setProductDetails(null);
        setErrorMessage(null);
        setShowProductDetails(false);
        alert('Product deleted successfully.');
      } else {
        setErrorMessage('Error deleting product: ' + data.error);
        setShowProductDetails(false);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      setErrorMessage('Something went wrong. Please try again later.');
      setShowProductDetails(false);
    }
  };

  const handleProductCodeChange = (e) => {
    setProductCode(e.target.value);
    setErrorMessage(null);
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
            error={!productCode.trim() && !!errorMessage}
            helperText={!productCode.trim() && !!errorMessage ? errorMessage : ''}
          />
          <Button type="submit" variant="contained" color="primary">
            Fetch Product Details
          </Button>
        </form>
        {showProductDetails && productDetails && (
          <div>
            <h2>Product Details</h2>
            <img
              src={`data:image/jpeg;base64, ${productDetails.image}`} // Use the "data" URL to display the image
              alt={productDetails.name}
              style={{ maxWidth: '60vw', boxShadow: '0px 0px 10px grey', borderRadius: '0.7rem' }}
            />
            <p>Code: {productDetails.code}</p>
            <p>Name: {productDetails.name}</p>
            <p>Size: {productDetails.size}</p>
            <p>Quantity: {productDetails.quantity}</p>
            <p>Amount: {productDetails.amount}</p>
            <p>Discount: {productDetails.discount}</p>
            <Button type="button" variant="contained" color="secondary" onClick={handleDeleteProduct}>
              Delete Product
            </Button>
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
    </Container>
  );
};

export default DeleteProduct;

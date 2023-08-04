import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, Snackbar, Alert } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import config from '../config';
const AddProduct = () => {
  const [productCode, setProductCode] = useState('')
  const [productName, setProductName] = useState('');
  const [productSize, setProductSize] = useState('');
  const [productAmount, setProductAmount] = useState('');
  const [productImageError, setProductImageError] = useState(false);
  const [productCodeError, setProductCodeError] = useState(false);
  const [productNameError, setProductNameError] = useState(false);
  const [productSizeError, setProductSizeError] = useState(false);
  const [productAmountError, setProductAmountError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Default to success
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarTimeout, setSnackbarTimeout] = useState(3000);
  const [alertMessage, setAlertMessage] = useState(null);


  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (snackbarOpen) {
      const timer = setInterval(() => {
        setSnackbarTimeout((prevTimeout) => prevTimeout - 100);
      }, 100);

      return () => {
        clearInterval(timer);
        setSnackbarTimeout(3000);
      };
    }
  }, [snackbarOpen]);
  // Function to clear the alert message after 3 seconds
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage]);
  const [formData, setFormData] = useState({
    code: '',
    image: '',
    name: '',
    size: '',
    amount: '',
  });

  // Regular expressions for validation rules
  const codeRegex = /^[a-zA-z0-9]+$/;
  const nameRegex = /^[a-zA-Z0-9\s]+$/;
  const sizeRegex = /^[0-9]+$/;
  const amountRegex = /^[0-9.]+$/;

  const handleChange = (e, fieldName) => {
    const { value } = e.target;

    // Update the corresponding state based on fieldName
    switch (fieldName) {
      case 'code':
        setProductCode(value);
        setFormData((prevFormData) => ({
          ...prevFormData,
          code: value,
        }));
        break;
      case 'name':
        setProductName(value);
        setFormData((prevFormData) => ({
          ...prevFormData,
          name: value,
        }));
        break;
      case 'size':
        setProductSize(value);
        setFormData((prevFormData) => ({
          ...prevFormData,
          size: value,
        }));
        break;
      case 'amount':
        setProductAmount(value);
        setFormData((prevFormData) => ({
          ...prevFormData,
          amount: value,
        }));
        break;
      default:
        break;
    }
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];

    if (imageFile) {
      setProductImageError(false);
      setFormData((prevFormData) => ({
        ...prevFormData,
        image: imageFile,
      }));
    } else {
      setProductImageError(true);
    }
  };
console.log(formData);
const handleSubmit = async (e) => {
  e.preventDefault();

  // Reset error states and messages
  setProductCodeError(false);
  setProductNameError(false);
  setProductSizeError(false);
  setProductAmountError(false);

  // Check if any field is empty or invalid before submitting

  if (!productCode.trim() || !codeRegex.test(productCode)) {
    setProductCodeError(true);
    return;
  }

  if (!productName.trim() || !nameRegex.test(productName)) {
    setProductNameError(true);
    return;
  }

  if (!productSize.trim() || !sizeRegex.test(productSize)) {
    setProductSizeError(true);
    return;
  }

  if (!productAmount.trim() || !amountRegex.test(productAmount)) {
    setProductAmountError(true);
    return;
  }

  // Proceed with form submission or data processing
  try {
    const formDataToSend = new FormData();
    formDataToSend.append('image', formData.image);
    formDataToSend.append('code', productCode);
    formDataToSend.append('name', productName);
    formDataToSend.append('size', productSize);
    formDataToSend.append('amount', productAmount);
    const addProductResponse = await fetch(`${config.apiBaseUrl}/addProduct`, {
      method: 'POST',
      body: formDataToSend,
    });

    if (addProductResponse.ok) {
      // Display success message
      setSnackbarSeverity('success');
      setSnackbarMessage('Product added successfully!');
      setSnackbarOpen(true);
      // Clear the form fields
      setProductCode('');
      setProductName('');
      setProductSize('');
      setProductAmount('');
    } else if (addProductResponse.status === 409) {
      // Product with the same code already exists
      setProductCodeError(true);
    } else {
      console.log(formDataToSend);
      // Display error message
      setSnackbarSeverity('error');
      setSnackbarMessage('Something went wrong. Please try again later.');
      setSnackbarOpen(true);
    }
  } catch (error) {
    // Display error message
    setSnackbarSeverity('error');
    setSnackbarMessage('Something went wrong. Please try again later.');
    setSnackbarOpen(true);
  }
};



return (
  <Container maxWidth="sm">
    <Box mt={3} >
      <Typography variant='h4' align='center' gutterBottom>
        Add Product
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Product Image"
          variant="outlined"
          type="file"
          onChange={handleImageChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          error={productImageError}
          helperText={setProductImageError ? 'Please select a product image' : ''}
        />
        <TextField
          fullWidth
          label="Product Code"
          variant="outlined"
          value={productCode}
          name="code"
          onChange={(e) => handleChange(e, 'code')}
          margin="normal"
          required
          error={productCodeError}
          helperText={productCodeError ? 'Product with this code is already exists' : ''}
        />
        <TextField
          fullWidth
          label="Product Name"
          variant="outlined"
          value={productName}
          name='name'
          onChange={(e) => handleChange(e, 'name')}
          margin="normal"
          required // Make the field required
          error={productNameError} // Set error state based on validation result
          helperText={productNameError ? 'Please enter a valid product name.' : ''}
        />
        <TextField
          fullWidth
          label="Product Size"
          variant="outlined"
          value={productSize}
          name='size'
          onChange={(e) => handleChange(e, 'size')}
          margin="normal"
          required // Make the field required
          error={productSizeError} // Set error state based on validation result
          helperText={productSizeError ? 'Please enter a valid product size.' : ''}
        />
        <TextField
          fullWidth
          label="Product Amount"
          variant="outlined"
          value={productAmount}
          name='amount'
          onChange={(e) => handleChange(e, 'amount')}
          margin="normal"
          required // Make the field required
          error={productAmountError} // Set error state based on validation result
          helperText={productAmountError ? 'Please enter a valid product amount.' : ''}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth startIcon={<AddCircleOutlineIcon />}>
          Add Product
        </Button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={snackbarTimeout}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
          <Box display="flex" alignItems="center">
            <Box width={`${(snackbarTimeout / 3000) * 100}%`} height={2} bgcolor="grey.400" />
            <Box width={`${((3000 - snackbarTimeout) / 3000) * 100}%`} height={2} />
          </Box>
        </Alert>
      </Snackbar>
    </Box>
  </Container>
);
};

export default AddProduct;

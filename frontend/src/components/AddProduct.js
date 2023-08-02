import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, Snackbar, Alert } from '@mui/material';

const AddProduct = () => {
  const [productCode, setProductCode] = useState('')
  const [productName, setProductName] = useState('');
  const [productSize, setProductSize] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productAmount, setProductAmount] = useState('');
  const [productDiscount, setProductDiscount] = useState('');
  const [error, setError] = useState({});
  // Validation state and error messages for each field
  const [productCodeError, setProductCodeError] = useState(false);
  const [productNameError, setProductNameError] = useState(false);
  const [productSizeError, setProductSizeError] = useState(false);
  const [productQuantityError, setProductQuantityError] = useState(false);
  const [productAmountError, setProductAmountError] = useState(false);
  const [productDiscountError, setProductDiscountError] = useState(false);
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
  useEffect(() => {
    setError({});
  }, [productCode]);
  const [formData, setFormData] = useState({
    code: '',
    image: '',
    name: '',
    size: '',
    quantity: '',
    amount: '',
    discount: '',
  });

  // Regular expressions for validation rules
  const codeRegex = /^[a-zA-z0-9]+$/;
  const nameRegex = /^[a-zA-Z0-9\s]+$/;
  const sizeRegex = /^[0-9]+$/;
  const quantityRegex = /^[0-9]+$/;
  const amountRegex = /^[0-9.]+$/;
  const discountRegex = /^[0-9]+$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setFormData((prevFormData) => ({
      ...prevFormData,
      image: imageFile,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset error states and messages
    setError({});
    setProductCodeError(false);
    setProductNameError(false);
    setProductSizeError(false);
    setProductQuantityError(false);
    setProductAmountError(false);
    setProductDiscountError(false);

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

    if (!productQuantity.trim() || !quantityRegex.test(productQuantity)) {
      setProductQuantityError(true);
      return;
    }

    if (!productAmount.trim() || !amountRegex.test(productAmount)) {
      setProductAmountError(true);
      return;
    }

    if (!productDiscount.trim() || !discountRegex.test(productDiscount)) {
      setProductDiscountError(true);
      return;
    }

    if (!formData.image) {
      setError({ image: 'Please upload a product image.' });
      return;
    }

    // Proceed with form submission or data processing
    try {

      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();

      if (data.some((product) => product.code === formData.code)) {
        setError({ code: 'Product with this code already exists.' });
        return;
      }
      const formDataToSend = new FormData();
      formDataToSend.append('image', formData.image);
      formDataToSend.append('code', productCode);
      formDataToSend.append('name', productName);
      formDataToSend.append('size', productSize);
      formDataToSend.append('quantity', productQuantity);
      formDataToSend.append('amount', productAmount);
      formDataToSend.append('discount', productDiscount);

      const addProductResponse = await fetch('http://localhost:5000/api/add-product', {
        method: 'POST',
        body: formDataToSend,
      });

      const responseData = await addProductResponse.json()
      if (addProductResponse.ok) {
        // Display success message
        // setAlertMessage({ type: 'success', message: 'Product added successfully!' });
        setSnackbarSeverity('success');
        setSnackbarMessage('Product added successfully!');
        setSnackbarOpen(true);
        // Clear the form fields
        setProductCode('');
        setProductName('');
        setProductSize('');
        setProductQuantity('');
        setProductAmount('');
        setProductDiscount('');
      } else if (addProductResponse.status === 409) {
        // Product with the same code already exists
        setError({ code: 'Product with this code already exists.' });
      } else {
        // Display error message
        // setAlertMessage({ type: 'error', message: 'Something went wrong. Please try again later.' });
        setSnackbarSeverity('error');
        setSnackbarMessage('Something went wrong. Please try again later.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      // Display error message
      // setAlertMessage({ type: 'error', message: 'Something went wrong. Please try again later.' });
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
          />
          <TextField
            fullWidth
            label="Product Code"
            variant="outlined"
            value={productCode}
            name="code"
            onChange={(e) => setProductCode(e.target.value)}
            margin="normal"
            required
            error={!!error.code || ''}
            helperText={error.code || ''}
          />
          <TextField
            fullWidth
            label="Product Name"
            variant="outlined"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
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
            onChange={(e) => setProductSize(e.target.value)}
            margin="normal"
            required // Make the field required
            error={productSizeError} // Set error state based on validation result
            helperText={productSizeError ? 'Please enter a valid product size.' : ''}
          />
          <TextField
            fullWidth
            label="Product Quantity"
            variant="outlined"
            value={productQuantity}
            onChange={(e) => setProductQuantity(e.target.value)}
            margin="normal"
            required // Make the field required
            error={productQuantityError} // Set error state based on validation result
            helperText={productQuantityError ? 'Please enter a valid product quantity.' : ''}
          />
          <TextField
            fullWidth
            label="Product Amount"
            variant="outlined"
            value={productAmount}
            onChange={(e) => setProductAmount(e.target.value)}
            margin="normal"
            required // Make the field required
            error={productAmountError} // Set error state based on validation result
            helperText={productAmountError ? 'Please enter a valid product amount.' : ''}
          />
          <TextField
            fullWidth
            label="Product Discount"
            variant="outlined"
            value={productDiscount}
            onChange={(e) => setProductDiscount(e.target.value)}
            margin="normal"
            required // Make the field required
            error={productDiscountError} // Set error state based on validation result
            helperText={productDiscountError ? 'Please enter a valid product discount.' : ''}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Add Product
          </Button>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={snackbarTimeout}
          onClose={handleSnackbarClose}
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
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

import React, { useState, useEffect } from 'react';
import {
  // All the imports...
  useMediaQuery,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Hidden,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  Fade,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  LinearProgress,
} from '@mui/material';
import theme from '../theme';
import { Link } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import html2canvas from 'html2canvas';
import config from '../config';
import LazyImage from './lazyImage';
const Home = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('code');
  const [order, setOrder] = useState('asc');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('code');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [editedProducts, setEditedProducts] = useState({});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openLoadingDialog, setOpenLoadingDialog] = useState(true);
  const [clientName, setClientName] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };
  // ... (handlePrintTable and other functions)

  const getCurrentDate = () => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = new Date().toLocaleDateString('en-US', options);
    setCurrentDate(currentDate);
  };

  useEffect(() => {
    getCurrentDate();
  }, []);

  const handlePrint = async () => {
    try {
      // Get the dialog content element
      const dialogContent = document.getElementById('preview-dialog-content');

      // Use html2canvas to capture the content as an image
      const canvas = await html2canvas(dialogContent, {
        scale: 10,
        dpi: 300, // Adjust the scale if needed
      });

      // Create a new image element to display the captured content
      const img = new Image();
      img.src = canvas.toDataURL('image/png');

      // Create a new window to display the image for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      printWindow.document.open();
      printWindow.document.write('<html><head><title>Preview</title></head><body style="text-align:center;">');
      printWindow.document.write('<h1>EssEss Wires</h1>');
      printWindow.document.write('<img src="' + img.src + '" style="max-width:100%;" />');
      printWindow.document.write('</body></html>');
      printWindow.document.close();

      // Wait for the image to load before triggering the print
      img.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    } catch (error) {
      console.error('Error while printing:', error);
    }
  };

  const fetchProductsWithoutImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiBaseUrl}/getProducts`, {
        method: 'GET',
      });
      const data = await response.json();
      // Exclude images from the initial fetch
      const productsWithoutImages = data.map(product => ({
        ...product
      }));

      // Fetch images one by one and update the products array

      setProducts(productsWithoutImages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching products:', error.message);
    }
  };

  useEffect(() => {
    fetchProductsWithoutImages().then(() => {
      setOpenLoadingDialog(false); // Close the dialog when products are loaded
    });
  }, [searchQuery]);
  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchQueryChange = (e) => {
    setLoading(false);
    setSearchQuery(e.target.value);
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const filteredProducts = products.filter((product) => {
    if (searchType === 'code') {
      return product.code.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (searchType === 'name') {
      return product.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return false;
  });
  const sortedProducts = filteredProducts
    .slice()
    .sort((a, b) => (order === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy])));

  const handleDeleteProduct = (product) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.filter((p) => p.code !== product.code)
    );

    setEditedProducts((prevEditedProducts) => {
      const updatedEditedProducts = { ...prevEditedProducts };
      delete updatedEditedProducts[product.code];
      return updatedEditedProducts;
    });
    if (selectedProducts.length === 1) {
      setEditModalOpen(false); // Close the dialog if no selected products left
    }
  };


  const handleAddToList = (product) => {
    if (selectedProducts.some((p) => p.code === product.code)) {
      handleDeleteProduct(product);
    } else {
      setSelectedProducts((prevSelectedProducts) => [...prevSelectedProducts, product]);
    }
  };

  const handleProductDetailChange = (e, product) => {
    const { name, value } = e.target;
    setEditedProducts((prevEditedProducts) => {
      if (prevEditedProducts[product.code] !== null) {
        return {
          ...prevEditedProducts,
          [product.code]: {
            ...prevEditedProducts[product.code],
            [name]: value,
          },
        };
      } else {
        return prevEditedProducts;
      }
    });
  };




  const handleEnableEdit = (product) => {
    setEditedProducts((prevEditedProducts) => {
      const isEditing = prevEditedProducts[product.code] !== null;
      return {
        ...prevEditedProducts,
        [product.code]: isEditing ? null : { ...product },
      };
    });
  };



  // Function to handle opening the edit modal
  const handleOpenEditModal = () => {
    setEditModalOpen(true);
  };

  // Function to handle closing the edit modal
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };
  const handlePrintTable = () => {
    handlePrint(selectedProducts, editedProducts);
  };

  const isBelowMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="md">
      <Box mt={3}>
        <Typography variant="h4" align="center" gutterBottom>
          All Products
        </Typography>
        <Grid container justifyContent={'center'} alignItems={'center'} spacing={2}>
          <Grid item>
            <FormControl sx={{ minWidth: 120, margin: '16px' }}>
              <Select value={searchType} onChange={handleSearchTypeChange}>
                <MenuItem value="code">Code</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <TextField
              label="Search Query"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchQueryChange}
              sx={{ minWidth: 220, margin: '16px' }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleOpenEditModal();
                setEditedProducts({})
              }}
              disabled={!selectedProducts.length}
            >
              Proceed to Edit
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} mt={3}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {isBelowMd ? (
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.grey[700],
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                    }}
                  >
                    Collapsed
                  </TableCell>
                ) : (
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.grey[700],
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                    }}
                  >
                    Image
                  </TableCell>
                )}
                <Hidden mdDown>
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.grey[700],
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === 'code'}
                      direction={orderBy === 'code' ? order : 'asc'}
                      onClick={() => handleSortRequest('code')}
                    >
                      Code
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.grey[700],
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                    }}
                  >
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleSortRequest('name')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.grey[700],
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                    }}
                  >
                    Size
                  </TableCell>
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.grey[700],
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                    }}
                  >
                    Amount
                  </TableCell>
                </Hidden>
                <TableCell
                  sx={{
                    backgroundColor: theme.palette.grey[700],
                    color: theme.palette.common.white,
                    fontWeight: 'bold',
                  }}
                >
                  Add to List
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.length === 0 ? ( // Show message row when no products
                <tr>
                  <td colSpan="6">
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        padding: '16px',
                        margin:'16px 8em',
                        backgroundColor: 'rgba(255, 0, 0, 0.1)',
                      }}
                    >
                      <WarningIcon color="error" fontSize="large" />
                      <p style={{ margin: '8px 0' }}>No products available.</p>
                      <Button
                        component={Link}
                        to="/add-Product"
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleOutlineIcon />}
                      >
                        Add Product
                      </Button>
                    </Box>
                  </td>
                </tr>
              ) : (
                sortedProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product) => (
                    <React.Fragment key={product.code}>
                      {isBelowMd ? (
                        <TableRow>
                          <TableCell colSpan={7}>
                            <Accordion>
                              <AccordionSummary>
                                <LazyImage
                                  src={`${config.apiBaseUrl}/getProductsImage?code=${product.code}`}
                                  alt={product.name}
                                  style={{ maxWidth: '50px', boxShadow: '0px 0px 5px grey' }}
                                />
                                <Typography variant="body1" style={{ margin: '10px 20px' }}>
                                  Code: {product.code}
                                </Typography>
                                <TableCell>
                                  {selectedProducts.includes(product) ? (
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      startIcon={<DeleteIcon />}
                                      onClick={() => handleDeleteProduct(product)}
                                    >
                                      Delete
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outlined"
                                      color="primary"
                                      onClick={() => handleAddToList(product)}
                                    >
                                      Add to List
                                    </Button>
                                  )}
                                </TableCell>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div>
                                  <Typography variant="body1">Name: {product.name}</Typography>
                                  <Typography variant="body1">Size: {product.size}</Typography>
                                  <Typography variant="body1">Amount: {product.amount}</Typography>
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          </TableCell>
                        </TableRow>
                      ) : (
                        <TableRow>
                          <TableCell>
                            <LazyImage
                              src={`${config.apiBaseUrl}/getProductImage?code=${product.code}`}
                              alt={product.name}
                              style={{ maxWidth: '50px', boxShadow: '0px 0px 5px grey' }}
                            />
                          </TableCell>
                          <TableCell>{product.code}</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.size}</TableCell>
                          <TableCell>{product.amount}</TableCell>
                          <TableCell>
                            {selectedProducts.includes(product) ? (
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteProduct(product)}
                              >
                                Delete
                              </Button>
                            ) : (
                              <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleAddToList(product)}
                              >
                                Add to List
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />

      </Box>
      {/* Loading Dialog */}
      <Dialog open={openLoadingDialog} disableEscapeKeyDown disablebackdropclick='true'>
        <DialogTitle>Products are loading, please wait...</DialogTitle>
        <DialogContent>
          <LinearProgress />
        </DialogContent>
      </Dialog>

      {/* Modal for Editing Selected Products */}
      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={handleCloseEditModal}
        fullWidth
        maxWidth="md"
        TransitionComponent={Fade}
      >
        <DialogTitle>Edit Selected Products</DialogTitle>
        <DialogContent>
          { /* Add Client Name Text Field */}
          <TextField
            label="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            sx={{ marginBottom: '16px' }}
            required
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell> {/* Empty cell for checkbox */}
                  <TableCell>name</TableCell>
                  <TableCell>code</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedProducts.map((product) => (
                  <TableRow key={product.code}>
                    <TableCell sx={{ padding: 0 }}>
                      <Checkbox
                        checked={Boolean(editedProducts[product.code])}
                        onChange={() => handleEnableEdit(product)}
                      // sx={{ marginRight: '5px' }}
                      />
                    </TableCell>
                    {!isBelowMd ? ( // Render text fields in a row for larger screens
                      <>
                        <TableCell>{product.code}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <TextField
                            label="Size"
                            name="size"
                            value={
                              editedProducts[product.code]?.size !== undefined
                                ? editedProducts[product.code]?.size
                                : product.size
                            }
                            onChange={(e) => handleProductDetailChange(e, product)}
                            disabled={!Boolean(editedProducts[product.code])}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            label="Amount"
                            name="amount"
                            value={
                              editedProducts[product.code]?.amount !== undefined
                                ? editedProducts[product.code]?.amount
                                : product.amount
                            }
                            onChange={(e) => handleProductDetailChange(e, product)}
                            disabled={!Boolean(editedProducts[product.code])}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDeleteProduct(product)}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </>
                    ) : ( // Render text fields in a column for smaller screens
                      <TableCell colSpan={5}>
                        <TableCell sx={{ paddingLeft: "0" }}>{product.name}</TableCell>
                        <TableCell sx={{ padding: '32px' }}>{product.code}</TableCell>
                        <div>

                          <TextField
                            label="Size"
                            name="size"
                            value={
                              editedProducts[product.code]?.size !== undefined
                                ? editedProducts[product.code]?.size
                                : product.size
                            }
                            onChange={(e) => handleProductDetailChange(e, product)}
                            disabled={!Boolean(editedProducts[product.code])}
                            fullWidth
                          />
                          <TextField
                            label="Amount"
                            name="amount"
                            value={
                              editedProducts[product.code]?.amount !== undefined
                                ? editedProducts[product.code]?.amount
                                : product.amount
                            }
                            onChange={(e) => handleProductDetailChange(e, product)}
                            disabled={!Boolean(editedProducts[product.code])}
                            fullWidth
                          />
                        </div>
                        <TableCell>
                          <IconButton
                            onClick={() => handleDeleteProduct(product)}
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableCell>

                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}
            variant='outlined'
            color="error">
            Close
          </Button>
          <Button onClick={handlePreview} variant='contained' color="primary">
            Preview
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={previewOpen} onClose={handlePreviewClose} fullWidth maxWidth="md" TransitionComponent={Fade}>
        <DialogTitle>Preview</DialogTitle>
        <DialogContent id="preview-dialog-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            {/* Client Name */}
            <Typography variant="h6">Client Name: {clientName}</Typography>
            {/* Date */}
            <Typography variant="h6" align="right">Date: {currentDate}</Typography>
          </div>
          {/* Preview the edited products here */}
          <TableContainer component={Paper}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Image</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Code</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Name</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Size</th>
                  <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((product) => (
                  <tr key={product.code}>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                      <img src={`${config.apiBaseUrl}/getProductImage?code=${product.code}`} alt={product.name} style={{ maxWidth: '100px' }} />
                    </td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{product.code}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{product.name}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{editedProducts[product.code]?.size || product.size}</td>
                    <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{editedProducts[product.code]?.amount || product.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePreviewClose} variant="contained" color="primary">
            Close Preview
          </Button>
          {/* "Print" Button */}
          <Button onClick={handlePrintTable} variant="contained" color="primary">
            Print
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default Home;

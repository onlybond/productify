import React, { useState, useEffect } from 'react';
import {
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
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import theme from '../theme';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState('code');
  const [order, setOrder] = useState('asc');
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'GET',
      });
      const data = await response.json();

      // Convert image buffer to Base64 URL for each product
      const productsWithImageURLs = await Promise.all(
        data.map(async (product) => {
          const imageBlob = new Blob([new Uint8Array(product.image.data)]);
          const imageURL = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(imageBlob);
          });

          return { ...product, imageURL };
        })
      );

      setProducts(productsWithImageURLs);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  const clearProducts = () => {
    setProducts([]);
  };

  const handleSortRequest = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedProducts = products
    .slice()
    .sort((a, b) => (order === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy])));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    clearProducts();
  }, []);

  // Use the useMediaQuery hook to check the breakpoint
  const isBelowMd = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="md">
      <Box mt={3}>
        <Typography variant="h4" align="center" gutterBottom>
          All Products
        </Typography>
        <Grid container justifyContent="center" spacing={2}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={fetchProducts}>
              Show All Products
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={clearProducts}>
              Clear Table
            </Button>
          </Grid>
        </Grid>
        <TableContainer component={Paper} mt={3}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {/* Common TableCell for both breakpoints */}
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

                {/* TableCell for above md breakpoint */}
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

                  {/* Common TableCell for both breakpoints */}
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.grey[700],
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                    }}
                  >
                    Quantity
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
                  <TableCell
                    sx={{
                      backgroundColor: theme.palette.grey[700],
                      color: theme.palette.common.white,
                      fontWeight: 'bold',
                    }}
                  >
                    Discount
                  </TableCell>
                </Hidden>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedProducts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((product) => (
                  <React.Fragment key={product.code}>
                    {/* Collapsible TableRow for below md breakpoint */}
                    {isBelowMd ? (
                      <TableRow>
                        <TableCell colSpan={7}>
                          <Accordion>
                            <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
                              <img
                                src={`data:image/jpeg;base64, ${product.image}`}
                                alt={product.name}
                                style={{ maxWidth: '50px', boxShadow: '0px 0px 5px grey' }}
                              />

                              <Typography variant="body1" style={{margin:" 10px 20px"}}>Code: {product.code}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <div>
                                <Typography variant="body1">Name: {product.name}</Typography>
                                <Typography variant="body1">Size: {product.size}</Typography>
                                <Typography variant="body1">Quantity: {product.quantity}</Typography>
                                <Typography variant="body1">Amount: {product.amount}</Typography>
                                <Typography variant="body1">Discount: {product.discount}</Typography>
                              </div>
                            </AccordionDetails>
                          </Accordion>
                        </TableCell>
                      </TableRow>
                    ) : (
                      /* Regular TableRow for above md breakpoint */
                      <TableRow>
                        <TableCell>
                          <img
                            src={`data:image/jpeg;base64, ${product.image}`}
                            alt={product.name}
                            style={{ maxWidth: '100px', boxShadow: '0px 0px 5px grey' }}
                          />
                        </TableCell>
                        <TableCell>{product.code}</TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.size}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell>{product.amount}</TableCell>
                        <TableCell>{product.discount}</TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
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
    </Container>
  );
};

export default Home;

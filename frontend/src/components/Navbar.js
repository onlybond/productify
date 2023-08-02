// src/components/Navbar.js
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState([]);

  const isMobileScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static">
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Logo */}
          <Typography variant="h6" style={{ textDecoration: 'none', color: 'inherit' }}>
            Productify
          </Typography>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* Buttons (for larger screens) */}
          {!isMobileScreen && (
            <>
              {currentUser ? (
                <>
                  <Button color="inherit" component={Link} to="/home">
                    Home
                  </Button>
                  <Button color="inherit" component={Link} to="/add-product">
                    Add Product
                  </Button>
                  <Button color="inherit" component={Link} to="/delete-product">
                    Delete Product
                  </Button>
                  <Button color="inherit" component={Link} to="/update-product">
                    Update Product
                  </Button>
                  <Button color="inherit" component={Link} to="/logout">
                    Logout
                  </Button>
                </>
              ) : (
                null
              )}
            </>
          )}

          {/* Menu (for mobile screens) */}
          {isMobileScreen && currentUser && (
            <>
              <IconButton color="inherit" aria-label="menu" aria-haspopup="true" onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                {currentUser ? (
                  <>
                    <MenuItem component={Link} to="/Home" onClick={handleMenuClose}>
                      Home
                    </MenuItem>
                    <MenuItem component={Link} to="/add-product" onClick={handleMenuClose}>
                      Add Product
                    </MenuItem>
                    <MenuItem component={Link} to="/delete-product" onClick={handleMenuClose}>
                      Delete Product
                    </MenuItem>
                    <MenuItem component={Link} to="/update-product" onClick={handleMenuClose}>
                      Update Product
                    </MenuItem>
                    <MenuItem component={Link} to="/logout" onClick={handleMenuClose}>
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  null
                )}
              </Menu>
            </>
          )}

        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

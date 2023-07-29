// src/MainApp.js
import React, { useContext } from 'react';
import { AuthContext } from './components/auth/AuthContext';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import LoginPage from './components/auth/Login';
import LogoutPage from './components/auth/Logout';
import AddProductPage from './components/AddProduct';
import DeleteProductPage from './components/DeleteProduct';
import UpdateProductPage from './components/UpdateProduct';
import NotFound from './components/NotFound';
import Unauthorized404 from './components/Unauthorized404';
const MainApp = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Route to the login page */}
        <Route path="/" element={<LoginPage />} />

        {/* If currentUser is true, show protected routes */}
        {currentUser && (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/delete-product" element={<DeleteProductPage />} />
            <Route path="/update-product" element={<UpdateProductPage />} />
          </>
        )}

        {/* If currentUser is false, show unauthorized routes */}
        {!currentUser && <Route path="*" element={<Unauthorized404 />} />}

        {/* Handle unknown routes */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};



export default MainApp;

// auth/AuthContext.js
import React, { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // Retrieve the user data from session storage, if available
  const initialCurrentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;
  const [currentUser, setCurrentUser] = useState(initialCurrentUser);

  // Function to simulate user login
  const login = (email, password) => {
    // In a real app, you would validate the user's credentials against a database here
    // For simplicity, we'll assume a single predefined user
    if (email === 'essess@admin.com' && password === 'Essess123') {
      const user = { email };
      // Save the user data to session storage
      sessionStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  // Function to simulate user logout
  const logout = () => {
    // Remove the user data from session storage
    sessionStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  // Check session storage on component mount and update the currentUser state
  useEffect(() => {
    const userFromStorage = JSON.parse(sessionStorage.getItem('currentUser'));
    if (userFromStorage) {
      setCurrentUser(userFromStorage);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

import React from 'react';
import AuthProvider from './components/auth/AuthContext';
import MainApp from './MainApp';

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;

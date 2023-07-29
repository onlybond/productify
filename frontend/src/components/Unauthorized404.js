import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized404 = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Unauthorized Access</h1>
      <p>You do not have permission to access this page.</p>
      <Link to="/" style={{ textDecoration: 'none' }}>
        <button style={{ padding: '10px 20px', backgroundColor: 'blue', color: 'white', cursor: 'pointer', border: 'none', borderRadius: '4px' }}>
          Go to Login
        </button>
      </Link>
    </div>
  );
};

export default Unauthorized404;

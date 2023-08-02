let apiBaseUrl;

if (process.env.NODE_ENV === 'production') {
  // Use serverless functions URL on production (build) environment
  apiBaseUrl = '/.netlify/functions';
} else {
  // Use localhost URL on local development environment
  apiBaseUrl = 'http://localhost:5000';
}

export default { apiBaseUrl };

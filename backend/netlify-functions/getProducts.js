// backend/netlify-functions/getProducts.js
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.handler = async (event, context) => {
  try {
    console.log('Event:', event);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const products = await Product.find({});

    // Convert the image buffer to Base64 for each product
    const productsWithBase64Images = products.map((product) => ({
      ...product._doc,
      image: product.image.toString('base64'),
    }));
    console.log('Disconnecting from MongoDB');
    mongoose.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify(productsWithBase64Images),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

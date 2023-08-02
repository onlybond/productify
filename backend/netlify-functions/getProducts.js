// backend/netlify-functions/getProducts.js
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.handler = async (event, context) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const products = await Product.find({});

    // Convert the image buffer to Base64 for each product
    const productsWithBase64Images = products.map((product) => ({
      ...product._doc,
      image: product.image.toString('base64'),
    }));

    mongoose.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify(productsWithBase64Images),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

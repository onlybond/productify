// backend/netlify-functions/getProduct.js
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.handler = async (event, context) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const code = event.queryStringParameters.code;
    const product = await Product.findOne({ code });

    if (!product) {
      mongoose.disconnect();
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Product not found.' }),
      };
    }

    // Convert the image buffer to Base64 before sending it to the frontend
    const imageBase64 = product.image.toString('base64');

    mongoose.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify({
        code: product.code,
        name: product.name,
        size: product.size,
        quantity: product.quantity,
        amount: product.amount,
        discount: product.discount,
        image: imageBase64,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

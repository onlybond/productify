// netlify-functions/deleteProduct.js

const mongoose = require('mongoose');
const Product = require('../models/product');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const code = event.queryStringParameters.code;
    const deletedProduct = await Product.findOneAndDelete({ code });

    mongoose.disconnect();

    if (!deletedProduct) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Product not found.' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Product deleted successfully.' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

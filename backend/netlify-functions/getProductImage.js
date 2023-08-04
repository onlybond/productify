// netlify-functions/getProductImage.js

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
    const product = await Product.findOne({ code });

    mongoose.disconnect();

    if (!product || !product.image) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Product not found or no image available.' }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: product.image.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

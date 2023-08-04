const mongoose = require('mongoose');
const Product = require('../backend/models/product');

exports.handler = async (event, context) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const code = event.queryStringParameters.code;
    const product = await Product.findOne({ code });

    if (!product || !product.image) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Product not found or no image available.' }),
      };
    }

    const response = {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/jpeg', // Set the content type to image/jpeg
      },
      body: product.image.toString('base64'),
      isBase64Encoded: true,
    };

    mongoose.disconnect();

    return response;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

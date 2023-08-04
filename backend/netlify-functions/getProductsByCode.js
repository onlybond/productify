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

    mongoose.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify({
        code: product.code,
        name: product.name,
        size: product.size,
        amount: product.amount,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

// netlify-functions/updateProduct.js

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
    const { name, size, amount } = JSON.parse(event.body);
    const imageFile = event.body.image;

    let product = await Product.findOne({ code });

    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Product not found.' }),
      };
    }

    product.name = name;
    product.size = size;
    product.amount = amount;

    if (imageFile) {
      product.image = Buffer.from(imageFile, 'base64');
    }

    await product.save();

    mongoose.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Product updated successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

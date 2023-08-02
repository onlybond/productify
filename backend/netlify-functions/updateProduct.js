// backend/netlify-functions/updateProduct.js
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.handler = async (event, context) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { code } = event.queryStringParameters;
    const { name, size, quantity, amount, discount } = JSON.parse(event.body);
    const imageBuffer = Buffer.from(event.body, 'base64');

    let product = await Product.findOne({ code });

    if (!product) {
      mongoose.disconnect();
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'Product not found.' }),
      };
    }

    product.name = name;
    product.size = size;
    product.quantity = quantity;
    product.amount = amount;
    product.discount = discount;
    product.image = imageBuffer;

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

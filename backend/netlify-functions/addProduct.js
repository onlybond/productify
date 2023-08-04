// netlify-functions/addProduct.js

const mongoose = require('mongoose');
const multer = require('multer');
const Product = require('../models/product');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { code, name, size, amount } = JSON.parse(event.body);
    const imageFile = event.body.image;

    if (!imageFile) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Image is required.' }),
      };
    }

    const image = Buffer.from(imageFile, 'base64');

    const existingProduct = await Product.findOne({ code });
    if (existingProduct) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'Product with this code already exists.' }),
      };
    }

    const newProduct = new Product({ image, code, name, size, amount });
    await newProduct.save();

    mongoose.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Product added successfully' }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

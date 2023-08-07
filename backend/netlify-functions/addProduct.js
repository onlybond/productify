const mongoose = require('mongoose');
const Product = require('../models/product');

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { code, name, size, amount, image } = JSON.parse(event.body);

    if (!image) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Image is required.' }),
      };
    }

    // Decode the base64 image data
    const imageBuffer = Buffer.from(image, 'base64');

    const existingProduct = await Product.findOne({ code });
    if (existingProduct) {
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'Product with this code already exists.' }),
      };
    }
    const newProduct = new Product({ image: imageBuffer, code, name, size, amount });
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

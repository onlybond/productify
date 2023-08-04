const mongoose = require('mongoose');
const Product = require('../models/product');

exports.handler = async (event, context) => {
  try {
    console.log('Event:', event);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    const products = await Product.find({}, { image: 0 }); // Exclude the 'image' field

    console.log('Disconnecting from MongoDB');
    mongoose.disconnect();

    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};

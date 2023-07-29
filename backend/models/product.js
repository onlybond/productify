// backend/models/product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  image: {
    type: Buffer, // Use Buffer to store binary data (images)
    required: true,
  },
  code:{
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('Product', productSchema);

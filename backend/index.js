const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();
const port = 5000;

// Load environment variables from .env file
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
  });

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Import the product model
const Product = require('./models/product');

app.get('/getProducts', async (req, res) => {
  try {
    const products = await Product.find({}, { image: 0 }); // Exclude image data

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getProductByCode', async (req, res) => {
  try {
    const code = req.query.code;
    const product = await Product.findOne({ code },{image:0});

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({
      code: product.code,
      name: product.name,
      size: product.size,
      amount: product.amount,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.error('Error fetching product:', error.message);
  }
});


app.delete('/deleteProduct', async (req, res) => {
  try {
    const code = req.query.code;

    // Find the product by code and delete it from the database
    const deletedProduct = await Product.findOneAndDelete({ code });

    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    res.json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/addProduct', upload.single('image'), async (req, res) => {
  try {
    const { code, name, size, amount } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ error: 'Image is required.' });
    }

    // Process the image file here, e.g., save it to the server or a cloud storage service
    // For now, we'll just store the image as binary data in the database
    const image = imageFile.buffer;

    // Check if a product with the same code already exists
    const existingProduct = await Product.findOne({ code });
    if (existingProduct) {
      return res.status(409).json({ error: 'Product with this code already exists.' });
    }

    const newProduct = new Product({ image, code, name, size, amount });
    await newProduct.save();

    res.json({ success: true, message: 'Product added successfully' });
    console.log('Product added successfully');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.error('Error adding product:', error.message);
  }
});

// Add this route to your existing index.js file

app.get('/getProductImage', async (req, res) => {
  try {
    const code = req.query.code;
    const product = await Product.findOne({ code });

    if (!product || !product.image) {
      return res.status(404).json({ error: 'Product not found or no image available.' });
    }

    res.set('Content-Type', 'image/jpeg'); // Set the content type to image/jpeg
    res.send(product.image);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.error('Error fetching product image:', error.message);
  }
});


app.put('/updateProduct', upload.single('image'), async (req, res) => {
  try {
    const code = req.query.code;
    const { name, size, amount } = req.body;
    const imageFile = req.file;

    // Find the product by code
    let product = await Product.findOne({ code });

    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    // Update the product details
    product.name = name;
    product.size = size;
    product.amount = amount;

    if (imageFile) {
      // Process the image file here, e.g., save it to the server or a cloud storage service
      // For now, we'll just store the image as binary data in the database
      product.image = imageFile.buffer;
    }

    await product.save();
    res.json({ success: true, message: 'Product updated successfully' });
    console.log('Product updated successfully');
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
    console.error('Error updating product:', error.message);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

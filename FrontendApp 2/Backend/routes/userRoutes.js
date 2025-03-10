const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const cors = require('cors');
const morgan = require('morgan');

const router = express.Router();

// Middleware
router.use(cors());
router.use(morgan('combined'));

// Ensure 'uploads' directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and JPG are allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// 1. Register a new user with an image
router.post('/register', upload.single('image'), (req, res) => {
  const { username, brandName, contact, state, city, address } = req.body;
  const image = req.file ? `http://localhost:5001/uploads/${req.file.filename}` : null;

  if (!username || !contact || !city || !state || !address) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = `
    INSERT INTO users (username, brandName, contact, state, city, address, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [username, brandName, contact, state, city, address, image],
    (err, result) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to register user' });
      }
      res.status(201).json({ message: 'User registered successfully!', image });
    }
  );
});

// 2. Get all users (with image URLs)
router.get('/users', (req, res) => {
  const query = 'SELECT *, CONCAT("http://localhost:5001", image) AS image_url FROM users';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(results);
  });
});

// 3. Search users by name and city
router.get('/users/search', (req, res) => {
  const { name, city } = req.query;
  const query = `
    SELECT *, CONCAT("http://localhost:5001", image) AS image_url 
    FROM users 
    WHERE (username LIKE ? OR brandName LIKE ?) AND city LIKE ?
  `;
  const searchName = `%${name}%`;
  const searchCity = `%${city}%`;
  db.query(query, [searchName, searchName, searchCity], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }
    res.json(results);
  });
});

// 4. Fetch products for a specific user
router.get('/users/:userId/products', (req, res) => {
  const { userId } = req.params;

  const query = `
    SELECT id, name, image, price, quantity, isPurchased 
    FROM products 
    WHERE userId = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(results);
  });
});

// 5. Toggle product purchase status
router.put('/products/:productId/toggle-purchase', (req, res) => {
  const { productId } = req.params;

  const query = `
    UPDATE products 
    SET isPurchased = NOT isPurchased 
    WHERE id = ?
  `;
  db.query(query, [productId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to toggle purchase status' });
    }
    res.json({ message: 'Purchase status toggled successfully' });
  });
});

// 6. Add a new product with an image
router.post('/products', upload.single('image'), (req, res) => {
  const { name, price, quantity, userId } = req.body;
  const image = req.file ? `http://localhost:5001/uploads/${req.file.filename}` : null;

  if (!name || !price || !quantity || !userId) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (isNaN(price) || isNaN(quantity)) {
    return res.status(400).json({ error: 'Price and quantity must be numbers' });
  }

  const query = 'INSERT INTO products (name, image, price, quantity, userId) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [name, image, price, quantity, userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to add product' });
    }
    res.status(201).json({ message: 'Product added successfully!', image });
  });
});

// 7. Generate dispatch bill for a user (name and address only)
router.get('/bill/:userId', (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT username, CONCAT(state, ', ', city) AS address 
    FROM users 
    WHERE id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to generate bill' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(results[0]); // Return user's name and address
  });
});

module.exports = router;
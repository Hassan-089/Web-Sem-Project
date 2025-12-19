require('dotenv').config();
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const connectDB = require('./config/db');

// View engine
app.set('view engine', 'ejs');
connectDB();
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // ← this file
// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/checkout', (req, res) => {
  res.render('checkout', { title: 'Checkout' });
});
app.get('/product', (req, res) => {
  res.render('product', { title: 'Product' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

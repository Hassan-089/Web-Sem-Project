require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/product');

mongoose.connect(process.env.MONGO_URI);

const products = [
  {
    name: 'Laptop',
    price: 1200,
    category: 'electronics',
    image: '/images/laptop.jpg',
    description: 'High performance laptop'
  },
  {
    name: 'Shoes',
    price: 80,
    category: 'fashion',
    image: '/images/shoes.jpg',
    description: 'Comfortable shoes'
  }
];

Product.insertMany(products).then(() => {
  console.log('Data Inserted');
  process.exit();
});

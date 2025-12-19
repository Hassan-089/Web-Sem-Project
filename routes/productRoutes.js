const express = require('express');
const Product = require('../models/product');
const router = express.Router();

router.get('/', async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 6;
  const skip = (page - 1) * limit;

  const filter = {};

  if (req.query.category) {
    filter.category = req.query.category;
  }

  if (req.query.minPrice && req.query.maxPrice) {
    filter.price = {
      $gte: req.query.minPrice,
      $lte: req.query.maxPrice
    };
  }

  const products = await Product.find(filter)
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  res.render('products', {
    products,
    page,
    totalPages: Math.ceil(total / limit)
  });
});

module.exports = router;

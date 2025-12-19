const express = require('express');
const router = express.Router();
const Product = require('../models/product');

// GET: Render Add Product page with list of products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.render('admin/product-management', {
            products,
            editMode: false,
            product: {},
            layout: 'layouts/main' // Ensure layout is used
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// POST: Add new product
router.post('/add', express.urlencoded({ extended: true }), async (req, res) => {
    const { name, price, color, department, description, image } = req.body;
    const newProduct = new Product({ name, price, color, department, description, image });
    try {
        await newProduct.save();
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error saving product");
    }
});

// GET: Edit product (populate form)
router.get('/edit/:id', async (req, res) => {
    try {
        const products = await Product.find({});
        const productToEdit = await Product.findById(req.params.id);
        res.render('admin/product-management', {
            products,
            editMode: true,
            product: productToEdit,
            layout: 'layouts/main'
        });
    } catch (err) {
        console.error(err);
        res.redirect('/admin');
    }
});

// POST: Update product
router.post('/edit/:id', express.urlencoded({ extended: true }), async (req, res) => {
    const { name, price, color, department, description, image } = req.body;
    try {
        await Product.findByIdAndUpdate(req.params.id, { name, price, color, department, description, image });
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating product");
    }
});

// POST: Delete product
router.post('/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting product");
    }
});


const Order = require('../models/order'); // Import Order model

// GET: View All Orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.render('admin/orders', {
            orders,
            title: 'Manage Orders',
            layout: 'layouts/main'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

// POST: Update Order Status
router.post('/order/update-status', async (req, res) => {
    const { orderId, newStatus } = req.body;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).send("Order not found");
        }

        // Logic to prevent skipping allowed states
        const allowedTransitions = {
            'Placed': ['Processing'],
            'Processing': ['Delivered'],
            'Delivered': []
        };

        const allowedNext = allowedTransitions[order.status];

        if (!allowedNext || !allowedNext.includes(newStatus)) {
            return res.status(400).send(`Invalid status transition from ${order.status} to ${newStatus}`);
        }

        order.status = newStatus;
        await order.save();

        res.redirect('/admin/orders');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating status");
    }
});

module.exports = router;

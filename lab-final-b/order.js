const express = require('express');
const router = express.Router();
const Product = require('../models/product');

const Order = require('../models/order');
const applyDiscount = require('./middlewares/discount'); // Import middleware

// Add to Cart Logic
router.get('/add-to-cart/:id', async (req, res) => {
    const productId = req.params.id;
    const cart = req.session.cart ? req.session.cart : {};

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.redirect('/');
        }

        if (cart[productId]) {
            cart[productId].qty++;
        } else {
            cart[productId] = {
                item: product,
                qty: 1,
                price: parseFloat(product.price)
            };
        }

        req.session.cart = cart;
        req.session.save(() => {
            res.redirect('/');
        });
    } catch (err) {
        console.log(err);
        res.redirect('/');
    }
});

// GET: Preview Order
router.get('/preview', applyDiscount, (req, res) => {
    if (!req.session.cart) {
        return res.render('order/preview', { products: [], totalPrice: 0, discount: 0, finalTotal: 0, title: 'Order Preview' });
    }

    const cart = req.session.cart;
    const products = [];
    let totalPrice = 0;

    for (const id in cart) {
        products.push(cart[id]);
        totalPrice += cart[id].qty * cart[id].price;
    }

    const discountAmount = totalPrice * req.discountRate;
    const finalTotal = totalPrice - discountAmount;

    res.render('order/preview', {
        products,
        totalPrice,
        discount: discountAmount,
        finalTotal,
        title: 'Order Preview'
    });
});

// POST: Confirm Order
router.post('/confirm', applyDiscount, async (req, res) => {
    if (!req.session.cart) {
        return res.redirect('/order/preview');
    }

    const cart = req.session.cart;
    const items = [];
    let basicTotal = 0;

    for (const id in cart) {
        items.push({
            product: cart[id].item._id,
            name: cart[id].item.name,
            price: cart[id].item.price,
            quantity: cart[id].qty,
            total: cart[id].qty * cart[id].price
        });
        basicTotal += cart[id].qty * cart[id].price;
    }

    const discountAmount = basicTotal * req.discountRate;
    const finalTotal = basicTotal - discountAmount;

    if (!req.body.customerEmail) {
        // Fallback if email is missing (should be prevented by frontend required)
        return res.redirect('/order/preview');
    }

    const order = new Order({
        items,
        totalAmount: finalTotal,
        discount: discountAmount,
        email: req.body.customerEmail,
        status: 'Placed'
    });

    try {
        await order.save();
        req.session.cart = null; // Clear cart
        req.session.coupon = null; // Clear coupon
        res.redirect('/order/success');
    } catch (err) {
        console.error(err);
        res.redirect('/order/preview');
    }
});

// GET: Success
router.get('/success', (req, res) => {
    res.render('order/success', { title: 'Order Success' });
});

module.exports = router;

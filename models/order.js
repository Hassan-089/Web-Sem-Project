const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: String,
            price: Number,
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            total: Number
        }
    ],
    discount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Placed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);

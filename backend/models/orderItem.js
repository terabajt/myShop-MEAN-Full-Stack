const mongoose = require('mongoose');
const { Product } = require('./product');

const orderItemSchema = mongoose.Schema({
	product: Product,
	quantity: number,
});

exports.OrderItem = mongoose.model('OrderIrem', orderItemSchema);

const mongoose = require('mongoose');
const { OrderItem } = require('./orderItem');
const { User } = require('./users');

const orderSchema = mongoose.Schema({
	orderItems: OrderItem,
	shippingAddress1: String,
	shippingAddress2: String,
	city: String,
	zip: String,
	country: String,
	phone: Number,
	status: String,
	totalPrice: Number,
	user: User,
	dateOrdered: Date,
});

exports.Order = mongoose.model('Order', orderSchema);

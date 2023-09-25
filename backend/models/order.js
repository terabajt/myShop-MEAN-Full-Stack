const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
	orderItems: String,
	shippingAddress1: String,
	shippingAddress2: String,
	city: String,
	zip: String,
	country: String,
	phone: Number,
	status: String,
	totalPrice: Number,
	user: String,
	dateOrdered: Date,
});

exports.Order = mongoose.model('Order', orderSchema);

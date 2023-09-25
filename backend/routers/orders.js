const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { User } = require('../models/user');

// localhost:3000/api/v1/order

router.get(``, async (req, res) => {
	const orderList = await User.find();
	if (!orderList) {
		res.status(500).json({ success: false });
	}
	res.send(orderList);
});

router.post(`/`, (req, res) => {
	const order = new Order({
		orderItems: res.body.orderItems,
		shippingAddress1: res.body.shippingAddress1,
		shippingAddress2: res.body.shippingAddress2,
		city: res.body.city,
		zip: res.body.zip,
		country: res.body.country,
		phone: res.body.phone,
		status: res.body.status,
		totalPrice: res.body.totalPrice,
		user: res.body.User,
		dateOrdered: res.body.dateOrdered,
	});
});

module.exports = router;

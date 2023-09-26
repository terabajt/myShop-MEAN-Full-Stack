const express = require('express');
const router = express.Router();
const { Order } = require('../models/order');
const { User } = require('../models/user');
const { OrderItem } = require('../models/order-item');

// localhost:3000/api/v1/order

router.get(`/`, async (req, res) => {
	const orderList = await Order.find().populate('user', 'name').sort({ dateOrder: -1 });
	if (!orderList) {
		res.status(500).json({ success: false });
	}
	res.send(orderList);
});

router.get(`/:id`, async (req, res) => {
	const order = await Order.findById(req.params.id)
		.populate('user', 'name')
		.populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } });
	if (!order) {
		res.status(500).json({ success: false });
	}
	res.send(order);
});

router.post(`/`, async (req, res) => {
	const orderItemsIds = Promise.all(
		req.body.orderItems.map(async orderitem => {
			let newOrderItem = new OrderItem({
				quantity: orderitem.quantity,
				product: orderitem.product,
			});

			newOrderItem = await newOrderItem.save();

			return newOrderItem._id;
		})
	);
	let orderItemsIdsResolver = await orderItemsIds;

	let order = new Order({
		shippingAddress1: req.body.shippingAddress1,
		shippingAddress2: req.body.shippingAddress2,
		city: req.body.city,
		zip: req.body.zip,
		country: req.body.country,
		phone: req.body.phone,
		status: req.body.status,
		totalPrice: req.body.totalPrice,
		user: req.body.user,
		orderItems: orderItemsIdsResolver,
	});

	order = await order.save();
	if (!order) return res.status(400).send('The order cannot be created');
	res.send(order);
});

module.exports = router;

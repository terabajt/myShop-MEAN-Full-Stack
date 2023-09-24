const express = require('express');
const router = express.Router();
const OrderItem = require('../models/orderItem');

// localhost:3000/api/v1/orderItem
router.get(`/`, async (req, res) => {
	const orderItemList = await OrderItem.find();
	if (!orderItemList) {
		res.status(500).json({ success: false });
	}
	res.send(orderItemList);
});

router.post(`/`, (req, res) => {
	const orderItem = new OrderItem({
		product: req.body.product,
		quantity: req.body.quantity,
	});
	orderItem.save().then(
		(createdOrderItem => {
			res.status(201).json(createdOrderItem);
		}).catch(err => {
			res.status(500).json({
				error: err,
				success: false,
			});
		})
	);
});

module.exports = router;

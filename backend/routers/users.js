const express = require('express');
const router = express.Router();
const User = require('../models/user');

// localhost:3000/api/v1/users
router.get(`/`, async (req, res) => {
	const userList = await Users.find();
	if (!userList) {
		res.status(500).json({ success: false });
	}
	res.send(userList);
});

router.post(`/`, (req, res) => {
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		passwordHash: req.body.passwordHash,
		street: req.body.street,
		apartment: req.body.apartment,
		city: req.body.city,
		zip: req.body.zip,
		country: req.body.country,
		phone: req.body.phone,
		isAdmin: req.body.isAdmin,
	});
	user
		.save()
		.then(createdUser => {
			res.status(201).json(createdUser);
		})
		.catch(err => {
			res.status(500).json({
				error: err,
				success: false,
			});
		});
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { Product } = require('../models/product');
const { Category } = require('../models/category');
const mongoose = require('mongoose');
const multer = require('multer');

// FILE UPLOAD

const FILE_TYPE_MAP = {
	'image/png': 'png',
	'image/jpeg': 'jpeg',
	'image/jpg': 'jpg',
};
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const isValid = FILE_TYPE_MAP[file.mimetype];
		let uploadError = new Error('Invalid image type');
		if (isValid) {
			uploadError = null;
		}
		cb(null, 'public/uploads');
	},
	filename: function (req, file, cb) {
		const fileName = file.originalname.split(' ').join('-');
		const extension = FILE_TYPE_MAP[file.mimetype];
		cb(null, `${fileName}-${Date.now()}.${extension}`);
	},
});

const uploadOptions = multer({ storage: storage });

// localhost:3000/api/v1/products
router.get(`/`, async (req, res) => {
	//localhost:3000/api/v1/products?categories=122121,32144
	let filter = {};
	if (req.query.categories) {
		filter = { category: req.query.categories.split(',') };
	}
	const productList = await Product.find(filter).populate('category');
	if (!productList) {
		res.status(500).json({ success: false });
	}
	res.send(productList);
});
router.get(`/:id`, async (req, res) => {
	const product = await Product.findById(req.params.id);
	if (!product) {
		res.status(500).json({ success: false });
	}
	res.send(product);
});

router.post(`/`, uploadOptions.single('image'), async (req, res) => {
	const category = await Category.findById(req.body.category);
	if (!category) return res.status(400).send('Invalid category!');

	const file = req.file;
	if (!file) return res.status(400).send('No image in the request');
	const fileName = req.file.filename;
	const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
	let product = new Product({
		name: req.body.name,
		description: req.body.description,
		richDescription: req.body.richDescription,
		image: `${basePath}${fileName}`,
		images: req.body.images,
		brand: req.body.brand,
		price: req.body.price,
		category: req.body.category,
		countInStock: req.body.countInStock,
		rating: req.body.rating,
		isFeatured: req.body.isFeatured,
		dateCreated: req.body.dateCreated,
	});
	product = await product.save();
	if (!product) return res.status(500).send('The product cannon be created');

	res.send(product);
});

router.put('/:id', uploadOptions.single('image'), async (req, res) => {
	if (!mongoose.isValidObjectId(req.params.id)) {
		res.status(400).send('Invalid Product ID');
	}
	const category = await Category.findById(req.body.category);
	if (!category) return res.status(400).send('Invalid category!');

	const product = await Product.findById(req.params.id);
	if (!product) return res.status(400).send('Invalid product');
	const file = req.file;

	let imagepath;
	if (file) {
		const fileName = req.file.filename;
		const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
		imagepath = `${basePath}${fileName}`;
	} else {
		imagepath = product.image;
	}

	const updatedProduct = await Product.findByIdAndUpdate(
		req.params.id,
		{
			name: req.body.name,
			description: req.body.description,
			richDescription: req.body.richDescription,
			image: imagepath,
			images: req.body.images,
			brand: req.body.brand,
			price: req.body.price,
			category: req.body.category,
			countInStock: req.body.countInStock,
			rating: req.body.rating,
			isFeatured: req.body.isFeatured,
			dateCreated: req.body.dateCreated,
		},
		{
			new: true,
		}
	);

	if (!updatedProduct) return res.status(400).send('The product cannot be updated!');

	res.send(updatedProduct);
});

router.delete('/:id', (req, res) => {
	Product.findByIdAndRemove(req.params.id)
		.then(product => {
			if (product) {
				return res.status(200).json({ success: true, message: 'The product is deleted!' });
			} else {
				return res.status(404).json({ success: false, message: 'Product not found!' });
			}
		})
		.catch(err => {
			return res.status(400).json({ success: false, error: err });
		});
});

router.get('/get/count', async (req, res) => {
	const productCount = await Product.countDocuments();

	if (!productCount) {
		res.status(500).json({ success: false });
	}
	res.send({
		productCount: productCount,
	});
});

router.get('/get/featured/:count', async (req, res) => {
	const count = req.params.count ? req.params.count : 0;
	const products = await Product.find({ isFeatured: true }).limit(+count);

	if (!products) {
		res.status(500).json({ success: false });
	}
	res.send(products);
});

router.put('/gallery-images/:id', uploadOptions.array('images', 10), async (req, res) => {
	if (!mongoose.isValidObjectId(req.params.id)) {
		res.status(400).send('Invalid Product ID');
	}
	const files = req.files;
	let imagesPaths = [];
	const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
	if (files) {
		files.map(file => {
			imagesPaths.push(`${basePath}${file.fileName}`);
		});
	}

	const updatedProduct = await Product.findByIdAndUpdate(
		req.params.id,
		{
			images: imagesPaths,
		},
		{
			new: true,
		}
	);

	if (!updatedProduct) return res.status(500).send('The images of product cannon be added');

	res.send(updatedProduct);
});
module.exports = router;

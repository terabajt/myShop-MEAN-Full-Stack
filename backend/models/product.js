const mongoose = require('mongoose');
const { Category } = require('./category');

const productSchema = mongoose.Schema({
	name: String,
	description: String,
	richDescription: String,
	image: String,
	images: String,
	brand: String,
	price: Number,
	category: Category,
	countInStock: Number,
	rating: Number,
	isFeatured: Boolean,
	dateCreated: Date,
});

exports.Product = mongoose.model('Product', productSchema);

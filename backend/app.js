const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const Product = require('./models/product');

require('dotenv/config');

const api = process.env.API_URL;

const productsRouter = require('./routers/product');

//Middleware
app.use(express.json());
app.use(morgan('tiny'));

//Routers
app.use(`${api}/products`, productsRouter);

mongoose
	.connect(process.env.CONNECTION_STRING)
	.then(() => {
		console.log('Connected to database');
	})
	.catch(err => {
		console.log(err);
	});

app.listen(3000, () => {
	console.log('server is running on localhost:3000');
});

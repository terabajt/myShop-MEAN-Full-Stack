function errorHandler(err, req, res, next) {
	//Authorization error
	if (err.name === 'UnauthorizedError') {
		return res.status(401).json({ message: 'The user is not authorized' });
	}
	//Validation error
	if (err.name === 'ValidationError') {
		return res.status(401).josn({ message: err });
	}

	//Default error
	return res.status(500).josn({ message: err });
}

module.exports = errorHandler;

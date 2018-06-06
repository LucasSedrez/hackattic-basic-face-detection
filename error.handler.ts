export function errorHandler(err, _req, res, _next) {

	console.error(err);

	res.status(err.status || 500);

	res.send({
		message: err.message,
		error: err
	});

	return;
}
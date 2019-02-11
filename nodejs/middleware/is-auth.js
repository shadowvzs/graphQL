const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
	
	// we set only information about user is authed
	// because we have a single route

	const authHeader = req.get('Authorization');
	if (!authHeader) {
		req.isAuth = false;
		return next();
	}

	// in header: Authorization: Bearer asdwdzasdwqer but we get Authorization value
	const token = authHeader.split(' ')[1];
	if (!token) {
		req.isAuth = false;
		return next();
	}
	
	// validate token with our secret key
	let decodedToken;
	try {
		decodedToken = jwt.verify(token, 'as2cdnjiZXwqklho129uZXnpoquwe');
	} catch(err) {
		req.isAuth = false;
		return next();
	}

	if (!decodedToken) {
		req.isAuth = false;
		return next();
	}

	req.isAuth = true;
	req/userId = decodedToken.userId;
	return next();
}
var jwt = require('jsonwebtoken');

U.getUserPermissions = function(permissions) {
    switch (permissions) {
        case 'USER':
            return 1;
        case 'ADMINISTRATOR':
            return 2;
        default:
            return null;
    }
};

U.encryptToken = function(payload, expires) {
	var config = {};
	if (expires) {
		config.expiresIn = expires;
	}
	return jwt.sign(payload, CONFIG('secret'), config);
};

U.decryptToken = function(token) {
	try {
		return jwt.verify(token, CONFIG('secret'));
	}
    catch (e) {
		return null;
	}
};
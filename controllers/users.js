exports.install = function() {
	F.route('/token', generateToken);
};

function generateToken() {
    var self = this;
    var token = U.encryptToken({
        uid: U.parseInt(self.query.id),
        action: 'API_TOKEN'
    });
    return self.json({ token });
}
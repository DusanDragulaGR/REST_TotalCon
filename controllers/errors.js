exports.install = function() {
    F.route('#400', handleError);
    F.route('#401', handleError);
    F.route('#403', handleError);
    F.route('#404', handleError);
    F.route('#500', handleError);
}; 

function handleError() {
    var self = this;
    self.status = U.parseFloat(self.route.name.substring(1, 4));
    return self.json(self.exception);
}
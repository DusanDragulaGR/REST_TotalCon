Controller.prototype.throw409 = function(err) {
    this.status = 409;
    return this.json(err);
};
exports.install = function() {
	F.route('/v0/companies', 				getCompanies, 		['authorize',		 				'GET', 		'*Company']);
	F.route('/v0/companies', 				processScenario,	['authorize',	'#administrator',	'POST', 	'*CompanyCreate']);
	F.route('/v0/companies/{companyID}',	getCompany,			['authorize', 						'GET', 		'*Company']);
	F.route('/v0/companies/{companyID}',	processScenario,	['authorize',	'#administrator',	'PUT', 		'*CompanyUpdate']);
	F.route('/v0/companies/{companyID}',	removeCompany,     	['authorize',	'#administrator',	'DELETE',   '*Company']);
};

function getCompanies() {
    var self = this;

    /* Skontrolujem či sa nenachádza v cache */

    var exists = F.cache.get(self.req.uri.path);
    if (exists) {
        return self.json(exists);
    }

    /* Načítam z databázy */

	self.$query(function(err, companies) {
		err && err.hasError() && (err.resourcePrefix == '');
		if (err && err.hasError()) {
			return self.throw500(err);
        }

        /* Uložím do cache */

        F.cache.set(self.req.uri.path, companies, '10 seconds');
		return self.json(companies);
	});
}

function getCompany(companyID) {
    var self = this;

    /* Skontrolujem či sa nenachádza v cache */

    var exists = F.cache.get(self.req.uri.path);
    if (exists) {
        return self.json(exists);
    }

    /* Načítam z databázy */

    self.$get({
		companyID: U.parseInt(companyID)
	}, function(err, company) {
		err && err.hasError() && (err.resourcePrefix = '');
        if (err && err.hasError('error-company-not-found')) {
            return self.throw404(err);
		}
        if (err && err.hasError()) {
            return self.throw500(err);
        }

        /* Uložím do cache */

        F.cache.set(self.req.uri.path, { company }, '10 seconds');
        return self.json({ company });
    });
}

function removeCompany(companyID) {
    var self = this;
    self.$remove({
		companyID: U.parseInt(companyID)
	}, function(err) {
		err && err.hasError() && (err.resourcePrefix = '');
        if (err && err.hasError('error-company-not-found')) {
            return self.throw404(err);
        }
        if (err && err.hasError()) {
            return self.throw500(err);
        }
        return self.json(SUCCESS(true));
    });
}

function processScenario(companyID) {
    var self = this;
    self.$workflow('exec', {
        controller: self,
        companyID: U.parseInt(companyID)
    }, function(err, result) {
        err && err.hasError() && (err.resourcePrefix = '');
        if (err && err.hasError('error-company-not-found')) {
            return self.throw404(err);
		}
		if (err && err.hasError('error-company-already-exists')) {
			return self.throw409(err);
		}
        if (err && err.hasError()) {
            return self.throw500(err);
        }
        return self.json(result && result.data ? result.data : SUCCESS(true));
    });
}
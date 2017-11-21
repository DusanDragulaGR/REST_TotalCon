NEWSCHEMA('CompanyUpdate').make(function(schema) {
    
    schema.define('name',   'String',       true);
    schema.define('ico',    'String(8)',    true);

    schema.setPrefix('error-company-');

    schema.addWorkflow('exec', function(error, model, options, callback) {

        var { controller, companyID } = options;

        var sql = DB(error);

        /* Existuje firma, ktorú idem aktualizovať? */

        sql.select('company', 'company').make(function(builder) {
            builder.where('id', companyID);
            builder.first();
        });
        sql.validate('company', 'error-company-not-found');

        /* Nevznikne mi aktualizáciou konflikt IČO? */

        sql.select('exists', 'company').make(function(builder) {
            builder.where('ico', model.ico);
            builder.where('id', '<>', companyID);
			builder.first();
		});
		sql.validate('exists', 'error-company-already-exists', true);

        /* Aktualizujem firmu */

        sql.update('company').make(function(builder) {
            builder.set(model.$clean());
            builder.where('id', companyID);
        });

        sql.exec((err, response) => callback());
    });

});
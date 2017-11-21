NEWSCHEMA('CompanyCreate').make(function(schema) {
    
    schema.define('name',   'String',       true);
    schema.define('ico',    'String(8)',    true);

    schema.setPrefix('error-company-');

    schema.addWorkflow('exec', function(error, model, options, callback) {

        var controller = options.controller;

        var sql = DB(error);

        /* Neexistuje už firma s daným IČO? */

        sql.select('exists', 'company').make(function(builder) {
			builder.where('ico', model.ico);
			builder.first();
		});
		sql.validate('exists', 'error-company-already-exists', true);

        /* Vytvorím firmu */

        sql.insert('company', 'company').make(function(builder) {
            builder.set(model.$clean());
        });

        sql.exec(function(err, response) {
            if (err) {
                return callback();
            }
            return callback({
                data: {
                    id: response.identity
                }
            });
        }, 'company');
    });

});
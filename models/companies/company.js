NEWSCHEMA('Company').make(function(schema) {
    
    schema.setQuery(function(error, options, callback, controller) {

        var sql = DB(error);

        /* Vyber zoznam firiem */

        sql.select('companies', 'company').make(function(builder) {
            builder.sort('name');
        });

        sql.exec(function(err, companies) {
            if (err) {
                return callback();
            }
            return callback({
                companies: companies.map(FUNCTION('formatCompanyDetail'))
            });
        }, 'companies');
    });

    schema.setGet(function(error, model, options, callback, controller) {
        
        var { companyID } = options;

        var sql = DB(error);

        /* Vyber firmu podľa ID */

        sql.select('company', 'company').make(function(builder) {
            builder.where('id', companyID);
            builder.first();
        });
        sql.validate('company', 'error-company-not-found');

        sql.exec(function(err, response) {
            if (err) {
                return callback();
            }
            return callback(FUNCTION('formatCompanyDetail')(response));
        }, 'company');
    });

    schema.setRemove(function(error, options, callback, controller) {
        
        var { companyID } = options;

        var sql = DB(error);

        /* Existuje firma, ktorú idem odstrániť? */

        sql.select('company', 'company').make(function(builder) {
            builder.where('id', companyID);
            builder.first();
        });
        sql.validate('company', 'error-company-not-found');

        /* Odstránim firmu */

        sql.remove('company').make(function(builder) {
            builder.where('id', companyID);
        });

        sql.exec((err, response) => callback());
    });

});
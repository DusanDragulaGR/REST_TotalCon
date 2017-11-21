F.onAuthorize = function(req, res, flags, next) {

    /* Sparsujem autorizacny token */

    var authorization = req.headers['authorization'];
    if (!authorization) {
        return next(false);
    }
    var bearer = authorization.split(' ')[1];
    if (!bearer) {
        return next(false);
    }
    var token = U.decryptToken(bearer);
    if (!token || token.action !== 'API_TOKEN' || !token.uid) {
        return next(false);
    }

    var sql = DB();

    /* Vyhľadám užívateľa podľa ID */
    
    sql.select('user', '"user"').make(function(builder) {
        builder.where('id', token.uid);
        builder.first();
    });
    sql.validate('user', 'not-authorized');

    /* Aktualizujem čas poslednej aktivity */

    sql.update('"user"').make(function(builder) {
        builder.set('lastActivityAt', F.datetime);
        builder.where('id', token.uid);
    });

    sql.exec(function(err, user) {
        if (err) {
            return next(false);
        }
        return next(true, user);
    }, 'user');
};
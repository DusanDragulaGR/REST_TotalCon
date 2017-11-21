F.middleware('administrator', function(req, res, next, options, controller) {
    if (controller.user.permissions != U.getUserPermissions('ADMINISTRATOR')) {
        return controller.throw403(new ErrorBuilder().push('error-permissions-denied'));
    }
    return next();
});
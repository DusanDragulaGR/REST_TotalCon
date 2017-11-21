F.functions.formatCompanyDetail = function(company) {
    return {
        id: U.parseInt(company.id),
        name: company.name || null,
        ico: company.ico || null
    };
};
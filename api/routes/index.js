module.exports = function(app){
    var search = require("../controllers/product-search");

    // redirect root to /product/search
    app.get('/', function(req, res){
        res.redirect('/product/search');
    });

    // call function in controller to get search result
    app.get('/product/search', search.get_item);
};
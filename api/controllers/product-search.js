// include models
var models = require('../models/product-search');

exports.get_item = function(req, res){
    var searchTerm = req.query.name;

    models.search_result(searchTerm, function(result){
        res.send(result); // result is in json format
    });
};
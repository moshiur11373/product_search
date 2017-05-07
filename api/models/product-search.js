
// use bestbuy npm to connect to BestBuy API
var bestBuy = require('bestbuy')('pfe9fpy68yg28hvvma49sc89');

// use walmart npm to connect to Walmart API
var walmart = require('walmart')('rm25tyum3p9jm9x9x7zxshfa');

exports.search_result = function(searchTerm, callback){
    // make sure the searchResult is empty
    var result = [];

    // call BestBuy to search on term
    search_bestbuy(searchTerm, function(searchResult){
        result = result.concat(searchResult);
    });

    // call Walmart to search on term
    search_walmart(searchTerm, function(searchResult){
        result = result.concat(searchResult);

        //sort result by ascending order on salePrice
        result = sortJsonArray(result, 'bestPrice', 'asc');

        //returning first item from sorted list
        callback(result[0]);
    });
};

// search at BestBuy using Promises
function search_bestbuy(searchTerm, callback){
    var searchResult = [];

    // make sure serachTerm exists, otherwise return empty list
    if(searchTerm == undefined){
        callback(searchResult);
        return;
    }
    // replace space with & as stated in BestBuy Rest API documentation
    searchTerm = searchTerm.replace(/ /g, '&search=');

    bestBuy.products('(search=' + searchTerm + ')', { show: 'salePrice,name'})
        .then(function(data){
            if(data.total === 0) console.log('No product found at BestBuy!');
            else{
                for(i = 0; i < data.total; i++){
                    // because some item doesn't have proper json format
                    try {
                        var array = {};
                        array["productName"] = data.products[i].name;
                        array["bestPrice"] = data.products[i].salePrice;
                        array["location"] = "BestBuy";
                        searchResult.push(array);
                    }
                    catch(err){ }
                }

                callback(searchResult);
            }
        })
        .catch(function (err){
            console.warn(err);
    });
}


// search at Walmart using Promisses
function search_walmart(searchTerm, callback){
    var searchResult = [];

    // make sure serachTerm exists, otherwise return empty list
    if(searchTerm == undefined){
        callback(searchResult);
        return;
    }

    walmart.search(searchTerm)
        .then(function(data){
            if(data.items.length === 0) console.log('No product found at Walmart!');
            else{
                for(i = 0; i < data.items.length; i++){
                    // because some item doesn't have proper json format
                    try {
                        var array = {};
                        array["productName"] = data.items[i].name;
                        array["bestPrice"] = data.items[i].salePrice;
                        array["location"] = "Walmart";
                        searchResult.push(array);
                    }
                    catch(err){}
                }

                callback(searchResult);
            }
        })
        .catch(function(err){
            console.warn(err);
        });
}

// sort json array
function sortJsonArray(array, prop, order){
    array = array.sort(function(a, b) {
        if (order == "asc") {
            return (a[prop] > b[prop]) ? 1 : ((a[prop] < b[prop]) ? -1 : 0);
        }
        if(order == "desc") {
            return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0);
        }
    });

    return array;
}



var express = require("express"),
    bodyParser = require("body-parser"),
    path = require("path"),
    http = require("http"),
    routes = require('./api/routes');

var app = express();

// set port
var port = process.env.PORT || 3000;

// set views folder
app.set('views', __dirname + '/views');

// Config body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// attach routes
routes(app);

// handles bad url and redirect to original url
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

http.createServer(app).listen(port, function(){
    console.log("The application server running at port:" + port);
});
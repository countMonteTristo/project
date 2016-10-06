var restify = require('restify');

var server = restify.createServer();
server.use(restify.fullResponse());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.bodyParser());


/*** set up db **********/
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/test_db');

var options = {
	name: 'nz_flora_logger server'

}

server.use(function(req, res, next) {
	//console.log('this is middleware 1', req.body);
	//res.header('Access-Control-Allow-Origin: *'); //add CORS header to every response
	console.log('first git commit')	;
	next();
});


//console.log('this is middleware 2', req.body);
server.use(function(req, res, next) {
	next();
});

module.exports = server;

require('./routes'); 		//NB circular dependency, but npm can handle this


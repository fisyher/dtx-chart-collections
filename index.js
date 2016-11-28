//Starting point for node server
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./api/routes');

// Define the port to run on
app.set('port', 10000);

// Add middleware to console log every request
app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next(); 
});

// Set static directory before defining routes
app.use(express.static(path.join(__dirname, 'public')));

//Parse body of posted forms
app.use(bodyParser.urlencoded({extended: false}));

//Add routing (Commented off until routes are fully defined)
app.use('/api', routes);

// Listen for requests
var server = app.listen(app.get('port'), function() {
  var port = server.address().port;
  console.log('Server listening on port ' + port);
});

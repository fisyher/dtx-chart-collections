var mongoose = require('mongoose'); 
var dburl = 'mongodb://localhost:27017/dtxdb'; 

//Set the node built-in Promise API as the main promise api for mongoose
mongoose.Promise = global.Promise;

mongoose.connect(dburl); 
 
mongoose.connection.on('connected', function(){ 
    console.log('Mongoose connected to ' + dburl); 
}); 
 
mongoose.connection.on('disconnected', function(){ 
    console.log('Mongoose disconnected'); 
}); 
 
mongoose.connection.on('error', function(err){ 
    console.log('Mongoose connection error: ' + err); 
}); 
 
//Import schema and models 
require('./songDtxCollection.model.js');
require('./users.model.js');
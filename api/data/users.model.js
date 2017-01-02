//Mongoose Model definition for users
var mongoose = require('mongoose');

var User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name:{
        type: String,
        required: true
    },
    password: {//hash, not the actual password
        type: String,
        required: true
    },
    _id: {
        type: String,
        required: true
    },
    join_date: {
        type: Date
    }
});


//Register the schema into mongoose
mongoose.model('UsersCollection', User, 'usersCollection');
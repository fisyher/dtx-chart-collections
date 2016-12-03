//Mongoose Model definition for users
var mongoose = require('mongoose');

var users = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    user_id: {
        type: String, //of UUID format
        required: true,
        unique: true
    },
    join_date: Date,
    songs_count: Number
});


//Register the schema into mongoose
mongoose.model('UsersCollection', users, 'usersCollection');
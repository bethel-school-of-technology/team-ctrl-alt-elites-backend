var mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var User = new Schema({
 user: {
    firstName: String,
    lastName: String,
    email: String
 }
});

// Compile model from schema
var UserModel = mongoose.model('Users', User );

module.exports = UserModel;
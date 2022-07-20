var mongoose = require('mongoose');

//Define Schema
var Schema = mongoose.Schema;

var Owner = new Schema({
    profile: String,
    img: String,
    id: Number,
    type: String,
    time: String, 
    location: String,
    price: Number,
    summary: String,
    description: String
});

//Compile model from Schema
var OwnerModel = mongoose.model("Owner", Owner)

module.exports = OwnerModel;
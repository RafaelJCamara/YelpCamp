const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//defining the campground schema
const CampgroundSchema = new Schema({
    title : String,
    price : String,
    description : String,
    location : String
});

//saving the schema and exporting it
module.exports = mongoose.model("Campground", CampgroundSchema);
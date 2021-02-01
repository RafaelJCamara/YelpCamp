const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("../models/campground.js");
const cities = require("./cities");
const {places, descriptors} = require("./seedHelpers");

//connect to database

//part 1
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
});

//part 2
const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", ()=>{
    console.log("Database connected...");
});



//returns a random element from an array
const sample = array => array[Math.floor(Math.random()*array.length)];

//seed our database
const seedDB = async ()=>{
    //delete database entries
    await Campground.deleteMany({});

    //create and save new instances
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            //for location, we will use the blueprint: city,state
            location:`${cities[random1000].city},${cities[random1000].state}`,
            //the title will be based on the descriptors and places
            title:`${sample(descriptors)} ${sample(places)}`
        });
        await camp.save();
    }
}

seedDB().then(()=>{
    db.close();
});
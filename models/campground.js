const mongoose = require("mongoose");
const { campgroundSchema } = require("../schemas");
const Review = require("./review");
const Schema = mongoose.Schema;

//defining the campground schema
const CampgroundSchema = new Schema({
    title : String,
    image : String,
    price : Number,
    description : String,
    location : String,
    author:{
        type: Schema.Types.ObjectId,
        ref:"User"
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
});

//define middleware
CampgroundSchema.post("findOneAndDelete", async function (camp) {
    if(camp){
        await Review.deleteMany({
            _id:{
                $in : camp.reviews
            }
        });
    }
});

//saving the schema and exporting it
module.exports = mongoose.model("Campground", CampgroundSchema);
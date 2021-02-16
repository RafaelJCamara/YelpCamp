const mongoose = require("mongoose");
const { campgroundSchema } = require("../schemas");
const Review = require("./review");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w_300");
});

//defining the campground schema
const CampgroundSchema = new Schema({
    title : String,
    images : [ImageSchema],
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
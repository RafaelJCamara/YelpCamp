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


//allow virtuals to be part of json
const opts = {
    toJSON:{
        virtuals:true
    }
};

//defining the campground schema
const CampgroundSchema = new Schema({
    title : String,
    images : [ImageSchema],
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
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
},opts);

//virtual for campground popup markup (text)
CampgroundSchema.virtual("properties.popUpMarkup").get(function(){
    return `
        <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <p>${this.description.substring(0,20)}...</p>
    `;
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
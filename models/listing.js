const mongoose = require("mongoose");
const Review = require("./review.js");
const { required } = require("joi");

const listingSchema = mongoose.Schema({
    title: {
        type:String,
        required:true
    },
    description:String,
    image: {
        filename:{
            type:String
        },
        url:{
            type:String
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    geometry:{
        type:{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;
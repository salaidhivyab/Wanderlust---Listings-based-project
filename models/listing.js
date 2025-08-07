const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: { type: String, default: "defaultimage" },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1530103043960-ef38714abb15?q=80..."
    }
  }
  ,
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{ //to delete reviews automatically when listing is deleted a post middleware
  if(listing){
    await Review.deleteMany({_id : {$in: listing.reviews}});
  }
  
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';
async function main(params) {
    await mongoose.connect(MONGO_URL);
};

main().then(()=>{
    console.log("connected to db");
}).catch(err => {
    console.log(err);
});

const initDB = async()=>{
    await Listing.deleteMany({});//clearing db
    initData.data = initData.data.map((obj) => ({...obj, owner: "688657e3bd127048c6322a38"}));
    await Listing.insertMany(initData.data);
    console.log("Data initialised");
}

initDB();

// const mongoose = require("mongoose");
// const initData = require("./data.js");
// const Listing = require("../models/listing.js");
// const { cloudinary } = require("../cloudConfig.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// async function main() {
//   await mongoose.connect(MONGO_URL);
// }

// main()
//   .then(() => {
//     console.log("✅ Connected to DB");
//   })
//   .catch((err) => {
//     console.log("❌ DB Connection Error:", err);
//   });

// const initDB = async () => {
//   try {
//     // Clear old data
//     await Listing.deleteMany({});
//     console.log("🗑️ Old listings deleted");

//     const listingsWithCloudinary = [];

//     for (let listing of initData.data) {
//       try {
//         // upload each image to cloudinary
//         const uploadedResponse = await cloudinary.uploader.upload(
//           listing.image.url,
//           {
//             folder: "wanderlust_DEV", // 👈 put in your Cloudinary folder
//           }
//         );

//         listingsWithCloudinary.push({
//           ...listing,
//           owner: "688657e3bd127048c6322a38", // replace with valid user id in your DB
//           image: {
//             url: uploadedResponse.secure_url,
//             filename: uploadedResponse.public_id,
//           },
//         });
//       } catch (err) {
//         console.error("❌ Error uploading to Cloudinary:", err);
//       }
//     }

//     await Listing.insertMany(listingsWithCloudinary);
//     console.log("🌱 Database seeded with Cloudinary images!");
//   } catch (err) {
//     console.error("❌ Error in initDB:", err);
//   } finally {
//     mongoose.connection.close();
//   }
// };

// initDB();


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
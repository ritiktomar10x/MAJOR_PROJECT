const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
// require("dotenv").config();
const DB_URL = `${process.env.ATLAS_DB}`;

main().then(console.log("CONNECTED to DB SUCCESSFULLY!")).catch(err=>console.log(err));

async function main() {
    await mongoose.connect(DB_URL);
};


let init = async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({ ...obj , owner: "687546ee268f6b60c7b32710"}));
    await Listing.insertMany(initData.data);
    console.log("Data inserted!");
};
init();
const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("connected to db!");
  } catch (err) {
   console.log(err);
  }
};
module.exports = db;

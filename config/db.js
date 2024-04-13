const mongoose = require("mongoose");

require("dotenv").config();
const dbURI = process.env.MONGODB_URI;
//connection to Db
const connectDB = () => {
  mongoose
    .connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => console.error(err));
};

module.exports = connectDB;

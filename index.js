const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");
const product = require("./routes/product.js");
const cloudinary = require("cloudinary").v2;
const user = require("./routes/user.js");
dotenv.config();
const PORT = process.env.PORT || 8080;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

connectDB();

app.use("/", product);
app.use("/", user);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

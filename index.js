const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const PORT = 8080;
const connectDB = require("./config/db.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

app.get("/products", (req, res) => {
  res.status(200).json({ message: "Products" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

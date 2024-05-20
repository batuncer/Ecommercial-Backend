const mongoose = require("mongoose");
const amqp = require("amqplib");
require("dotenv").config();

const dbURI = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const amqpServer = process.env.RABBITMQ_URI || "amqp://localhost:5672";
    const connection = await amqp.connect(amqpServer);
    const channel = await connection.createChannel();
    await channel.assertQueue("PRODUCT");
    await channel.assertQueue("USER");

    console.log("Connected to RabbitMQ");

    return { channel, connection };
  } catch (err) {
    console.error("Error connecting to database:", err);
  }
};

module.exports = connectDB;

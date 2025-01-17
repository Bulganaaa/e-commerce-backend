const mongoose = require("mongoose");

const connectDB = async () => {
    const conn = await mongoose.connect(
        process.env.MONGODB_URI
    );
    console.log(`MongoDb amjilttai holbogdson : ${conn.connection.host}`.cyan.bold);
}

module.exports = connectDB;
const express = require('express');
const dotenv = require('dotenv');
const logger = require("./middleware/logger");
const fs = require('fs');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const colors = require('colors');
const errorHandler = require('./middleware/error');
const categoriesRoutes = require('./routes/categories');
//app iin tohirgoog process.env ruu achaallah
dotenv.config({ path: './config/config.env' });

connectDB();

//route oruulj ireh


const app = express();
//Body parser
app.use(express.json());
//morgan write stream
//var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream }))
// app.use(morgan("dev"));


// app.use(logger);
app.use('/api/v1/categories',categoriesRoutes);
app.use(errorHandler);


const server = app.listen(
    process.env.PORT, 
    console.log(`Express server is running on port ${process.env.PORT}...`.inverse.bold));

process.on('unhandledRejection', (err, promise) => {
    console.log(`ALDAA GARLAA: ${err}`.underline.red.bold);
    server.close(() => {
        process.exit(1);
    });
});
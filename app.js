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
const productsRoutes = require('./routes/products');

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();

// Initialize express app
const app = express();

// Body parser
app.use(express.json());

// Morgan write stream
// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
// app.use(morgan('combined', { stream: accessLogStream }));
// app.use(morgan("dev"));

// Use logger middleware
app.use(logger);

// Mount routes
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/categories', categoriesRoutes);

// Use error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
    console.log(`Express server is running on port ${PORT}...`.inverse.bold);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`ALDAA GARLAA: ${err.message}`.underline.red.bold);
    server.close(() => {
        process.exit(1);
    });
});
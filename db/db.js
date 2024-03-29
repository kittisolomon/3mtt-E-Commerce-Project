const mongoose = require('mongoose');
require('dotenv').config();

const CONNECT_MONGODB_URL = process.env.CONNECT_MONGODB_URL;

function connectToMongoDB() {
    mongoose.connect(CONNECT_MONGODB_URL);

    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected succesfully');
    });

    mongoose.connection.on('error', (err) => {
        console.log('Error connecting to MongoDB');
        console.log(err);
    });

}

module.exports = { connectToMongoDB };
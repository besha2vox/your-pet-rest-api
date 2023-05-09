const mongoose = require('mongoose');
require('dotenv').config();

const { DB_HOST } = process.env;

const connectionDB = async () => {
    mongoose.connect(DB_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
};

module.exports = connectionDB;
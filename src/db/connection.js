require('dotenv').config();
const mongoose = require("mongoose");

const { DB_HOST } = process.env;

console.log(DB_HOST);

const connectionDB = async () => {
  mongoose.connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};


module.exports = connectionDB;

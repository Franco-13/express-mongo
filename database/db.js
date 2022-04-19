const mongoose = require('mongoose');
require("dotenv").config();

const clientDB = mongoose.connect(process.env.URI)
  .then((db) => {
    console.log("db connected")
    return db.connection.getClient()
  })
  .catch(() => console.log("db connection failed"));

module.exports = clientDB
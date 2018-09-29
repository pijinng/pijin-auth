const mongoose = require('mongoose');
const schemas = require('../models');
require('dotenv').config();

const MONGO_CONFIG = {
  keepAlive: true,
  connectTimeoutMS: 30000,
  socketTimeoutMS: 0,
  useNewUrlParser: true,
};

const connection = {};
connection.db = mongoose.createConnection(process.env.MONGO_URL, MONGO_CONFIG, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.info(`Mongo DB connection started on ${process.env.MONGO_URL}`);
});

connection.models = {};
connection.models.authorization = connection.db.model('Authorization', schemas.AuthorizationSchema);

module.exports = connection;

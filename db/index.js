const mongoose = require('mongoose');
const config = require('config');
const targetDB = config.get('db');

function connectionCallback(err) {
  if (err) {
    console.error(err.message);
  } else {
    console.info(`Connection successful on ${targetDB}`);
  }
}

async function connectDatabase() {
  const db = await mongoose.connect(targetDB, {useNewUrlParser: true, useUnifiedTopology: true }, connectionCallback() );
  return db;
}

module.exports = (app) => { connectDatabase() }
module.exports.connectDatabase = connectDatabase;
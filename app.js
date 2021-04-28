const morgan = require('morgan');
const express = require('express');

const app = express();
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./api/routes')(app);
require('./db')(app);

module.exports = app;
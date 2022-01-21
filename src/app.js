const express = require('express');

const app = express();

//Routes

const routes = require('./routes.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(routes);

module.exports = app;
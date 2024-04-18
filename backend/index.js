const express = require('express');
const app = express();

const RootRouter = require('./routes/index.js')

/*
routes
*/
app.use('/api/v1', require('RootRouter'));
const express = require('express');
const app = express();

const RootRouter = require('./routes/index.js')
const UserRouter = require('./routes/user.js')

/*
routes
*/
app.use('/api/v1', require('RootRouter'));
app.use('/api/v1/user', require('UserRouter'));
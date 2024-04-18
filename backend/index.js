const express = require('express');
const app = express();

const RootRouter = require('./routes/index.js')
const UserRouter = require('./routes/user.js')

/*
routes
*/
app.use('/api/v1', RootRouter);
app.use('/api/v1/user', UserRouter);
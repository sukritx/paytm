const express = require('express');
const cors = require('cors');

const RootRouter = require('./routes/index.js')
const UserRouter = require('./routes/user.js')

app.use(cors())
app.use(express.json());

const app = express();

/*
routes
*/
app.use('/api/v1', RootRouter);
app.use('/api/v1/user', UserRouter);

app.listen(3000);
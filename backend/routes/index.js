const express = require('express');
const router = express.Router();

app.use('/user', UserRouter);
app.use('/account', AccountRouter);

module.exports = router;
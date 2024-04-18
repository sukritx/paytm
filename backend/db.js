const mongoose = require('mongoose');
const { Schema } = mongoose;
require ('dotenv').config();

mongoose.connect('process.env.MONGO_URI')

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
})

const User = mongoose.model('User', userSchema);

module.exports = {
    User
};
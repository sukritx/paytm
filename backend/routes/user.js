const express = require('express');
const router = express.Router();

const zod = require('zod');
const { User } = require('../db.js')
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env.JWT_SECRET;

const signupBody = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    username: zod.string().email(),
    password: zod.string(),
})

router.post('/signup', async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ error: 'Email already taken / Incorrect inputs' });
    }

    const existingUser = await User.findOne( { username: req.body.username } );
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password
    });
    const userId = user._id

    const token = jwt.sign({
        userId: userId
    }, JWT_SECRET, { expiresIn: '24h' });

    res.json({
        message: "User created successfully",
        token: token
    })
})

module.exports = router;
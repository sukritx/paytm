const express = require('express');
const router = express.Router();

const zod = require('zod');
const { User } = require('../db.js')
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env.JWT_SECRET;

const { authMiddleware } = require('../middleware.js');

const signupBody = zod.object({
    firstName: zod.string(),
    lastName: zod.string(),
    username: zod.string().email(),
    password: zod.string(),
})

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string(),
})

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
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

router.post('/signin', async (req, res) => {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }

    const user = await user.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token 
        })
        return;
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

router.put('/user', authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    })
})

router.get('/bulk', authMiddleware, async (req,res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter,
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;
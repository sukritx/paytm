const express = require('express');
const mongoose = require('mongoose');
const { authMiddleware } = require('../middleware');
const router = express.Router();
const Account = require('../db.js')
const zod = require('zod');

const transactionBody = zod.object({
    amount: zod.number().positive(),
    to: zod.string().email()
})

router.get('/balance', authMiddleware, async (req,res) => {
    const account = await Account.findOne({
        userId :req.userId
    });

    res.json({
        balance: account.balance
    })
})

router.post('/transfer', authMiddleware, async (req,res) => {
    const session = await mongoose.startSession();

    session.startTransaction();
    const { amount, to } = req.body;

    const { success } = transactionBody.safeParse(req.body);
    if (!success) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid transaction"
        });
    }

    // Fetch the account
    const account = await Account.findOne({ userId: req.userId }).session(session);

    if(!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid recipient"
        });
    }

    // Process the transaction
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
});

module.exports = router;
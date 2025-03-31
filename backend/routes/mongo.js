const express = require('express');
const router = express.Router();
const { mongoose } = require('../db/mongo');

const Message = mongoose.model('Message', new mongoose.Schema({
    msg: String,
    created: { type: Date, default: Date.now }
}));

router.get('/mongo-test', async (req, res) => {
    try {
        console.log('Testing mongo');
        await Message.create({ msg: 'Hello from Mongoose' });
        const messages = await Message.find().sort({ created: -1 }).limit(5);
        res.json(messages);
    } catch (err) {
        console.error('MongoDB error: ', err);
        res.status(500).send('MongoDB failed');
    }
});

module.exports = router;
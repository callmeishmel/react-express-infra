const express = require('express');
const { connectRabbitMQ, getChannel } = require('../services/rabbitmq');

const router = express.Router();

router.get('/rabbit-send-test', async (req, res) => {
    try {
        await connectRabbitMQ();
        const channel = getChannel();
        const msg = `Hello from Express at ${new Date().toISOString()}`;
        channel.sendToQueue('messages', Buffer.from(msg));
        res.send(`Sent message to RabbitMQ: ${msg}`);
    } catch (err) {
        console.error('RabbitMQ send error: ', err);
        res.status(500).send('Failed to send message to RabbitMQ');
    }
});

module.exports = router;
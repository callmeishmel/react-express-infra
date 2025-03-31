const express = require('express');
const { redisClient, connectRedis } = require('../services/redis');

const router = express.Router();

router.get('/redis-test', async (req, res) => {
    try {
        await connectRedis();
        await redisClient.set('ping', 'pong');
        const value = await redisClient.get('ping');
        res.send(`Redis says: ${value}`);
    } catch (err) {
        console.error('Redis route error: ', err);
        res.status(500).send('Redis operation failed');
    }
});

module.exports = router;
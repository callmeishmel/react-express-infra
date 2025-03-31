const redis = require('redis');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis//localhost:6379'
});

redisClient.on('error', err => console.error('Redis error: ', err));

let initialized = false;

async function connectRedis() {
    if (!initialized && !redisClient.isOpen) {
        await redisClient.connect();
        initialized = true;
        console.log('Redis connected');
    }
}

module.exports = {
    redisClient,
    connectRedis
};
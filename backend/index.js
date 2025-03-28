const express = require('express');
const redis = require('redis');
const amqp = require('amqplib');

const app = express();
const port = 3000;

// Redis
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = redis.createClient({ url: redisUrl });

client.connect().then(() => {
    console.log('Connected to Redis');
}).catch(console.error);

// RabbitMQ
let channel;

async function connectRabbitMQ(retries = 5, delay = 2000) {
    for(let i = 0; i < retries; i++) {
        try {
            const connection = await amqp.connect(process.env.RABITMQ_URL || 'amqp://rabbitmq');
            channel = await connection.createChannel();
            await channel.assertQueue('messages');
            console.log('Connected to RabbitMQ');
            return;
        } catch (err) {
            console.error(`RabbitMQ connection failed (attempt ${i + 1}): `, err);
            await new Promise(res => setTimeout(res, delay));
        }
    }

    console.error('Express could not connect to RabbitMQ after retries.');
}

connectRabbitMQ();

// Middleware
app.use(require('cors')());

// Routes
app.get('/', async (req, res) => {
    await client.set('ping', 'pong');
    const value = await client.get('ping');
    res.send(`Redis says: ${value}`);
});

app.get('/send', async (req, res) => {
    if (!channel) {
        return res.status(500).send('RabbitMQ channel not ready');
    }

    const msg = `Hello from Expres at ${new Date().toISOString()}`;
    channel.sendToQueue('messages', Buffer.from(msg));
    res.send(`Sent message to RabbitMQ: ${msg}`);
});

// Server start
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

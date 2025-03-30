const express = require('express');
const redis = require('redis');
const amqp = require('amqplib');
const cors = require('cors');
const db = require('./db/postgres');
require('dotenv').config();

require('./db/mongo');
const Message = require('./models/Message');

const app = express();
const port = process.env.BACKEND_PORT || 3000;

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

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
.split(' ')
.map(origin => origin.trim())
.filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
      console.log('CORS origin:', origin);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
}));

// Routes

// Postgres test call
app.get('/pgtest', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.send(`Postgres time: ${result.rows[0].now}`);
    } catch (err) {
        console.error('Query error: ', err);
        res.status(500).send('Postgres query failed');        
    }
});

// MongoDB test call
app.get('/mongo-test', async (req, res) => {
    try {
        await Message.create({ msg: 'Hello from Mongoose' });

        const messages = await Message.find().sort({ created: -1 }).limit(5);
        res.json(messages);
    } catch (err) {
        console.error('Mongo error: ', err);
        res.status(500).send('MongoDB failed');
    }
});

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

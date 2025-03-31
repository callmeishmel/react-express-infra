const amqp = require('amqplib');
require('dotenv').config();

let channel;
let initialized = false;

const RABBITMQ_URL = process.env.RABBITMQ_URL;

async function connectRabbitMQ(retries = 5, delay = 2000) {
    if (initialized) return;

    for (let i = 0; i < retries; i++) {
        try {
            console.log('[RabbitMQ] Loading env... RABBITMQ_URL:', process.env.RABBITMQ_URL);

            if (!process.env.RABBITMQ_URL) {
              throw new Error('RABBITMQ_URL is not defined. Check your .env file and docker-compose setup.');
            }
            

            const connection = await amqp.connect(RABBITMQ_URL);
            channel = await connection.createChannel();
            await channel.assertQueue('messages');
            initialized = true;
            console.log('Connected to RabbitMQ');
            return;
        } catch (err) {
            console.error(`RabbitMQ connection failed (attempt ${i + 1})`, err);
            await new Promise(res => setTimeout(res, delay));
        }
    }

    throw new Error('Failed to connect to RabbitMQ after retries');
}

function getChannel() {
    if (!channel) throw new Error('RabbitMQ channel  is not ready');
    return channel;
}

module.exports = {
    connectRabbitMQ,
    getChannel
}
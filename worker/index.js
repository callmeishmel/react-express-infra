const amqp = require('amqplib');

async function connectRabbitMQ(retries = 5, delay = 2000) {
    for(let i = 0; i < retries; i++) {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq');
            const channel = await connection.createChannel();
            await channel.assertQueue('messages');
            console.log('Worker is listening for messages...');
    
            channel.consume('messages', (msg) => {
                if (msg !== null) {
                    console.log(`Received: ${msg.content.toString()}`);
                    channel.ack(msg);
                }
            });

            return;
        } catch (err) {
            console.error(`Worker connection failed (attempt ${i + 1}): `, err);
            await new Promise(res => setTimeout(res, delay));
        }
    }

    console.error('Worker could not connect to RabbitMQ after retries.');
}

connectRabbitMQ();
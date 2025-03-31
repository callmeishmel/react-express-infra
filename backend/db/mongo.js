const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

async function connectWithRetry(retries = 10, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            await mongoose.connect(MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('Connected to MongoDB via Mongoose');
            return;
        } catch (err) {
            console.error(`Mongoose connection failed (attempt ${i + 1})`, err);
            await new Promise(res => setTimeout(res, delay));            
        }      
    }

    console.lerror('Could not connect to MongoDB after retries.');
}

module.exports = {
    mongoose,
    connectWithRetry
};
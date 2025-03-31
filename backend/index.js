require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { waitForPostgres } = require('./db/postgres');
const { connectWithRetry: waitForMongo } = require('./db/mongo');

const app = express();
const port = process.env.BACKEND_PORT || 3000;

// CORS whitelist
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

// API routes
app.use('/api', require('./routes'));

// Server start after Postgres/RabbitMQ start
(async () => {
    try {
        await Promise.all([
            waitForPostgres(),
            waitForMongo()
        ]);
        
        app.listen(port, () => {
            console.log(`Server listening on http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Startup failed due to DB connectivity.', err);
        process.exit(1);
    }
})();


const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

let client;

async function connectWithRetry(retries = 10, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            client = await pool.connect();
            console.log('Connected to PostgreSQL (manual client)');
            return;
        } catch (err) {
            console.error(`Postgres connection failed (attempt ${i + 1})`, err);
            await new Promise((res) => setTimeout(res, delay));
        }
    }

    console.log('Could not connect to Postgres after retries.');
}

connectWithRetry();

module.exports = {
    query: (...args) => client.query(...args),
    client,
};

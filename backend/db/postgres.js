const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
});

pool.on('error', (err) => {
    console.error('Unexpected PG client error', err);
    process.exit(-1);
});

async function waitForPostgres(retries = 10, delay = 2000) {
    for (let i = 0; i < retries; i++) {
        try {
            await pool.query('SELECT 1');
            console.log('Postgres is ready');
            return;
        } catch (err) {
            console.warn(`Postgres not ready (attempt ${i + 1})`);
            await new Promise(res => setTimeout(res, delay));
        }      
    }
    throw new Error('Postgres not available after retries');
}

async function query(...args) {
    return pool.query(...args);
}

async function withTransaction(callback) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

module.exports = {
    query,
    withTransaction,
    waitForPostgres
};

const express = require('express');
const router = express.Router();
const db = require('../db/postgres');

router.get('/pg-test', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.send(`Postgres time: ${result.rows[0].now}`);
    } catch (err) {
        console.error('Postgres error: ', err);
        res.status(500).send('Postgres query failed');
    }
});

module.exports = router;

const express = require('express');
const redisRoutes = require('./redis');
const rabbitRoutes = require('./rabbitmq');
const postgresRoutes = require('./postgres');
const mongoRoutes = require('./mongo');

const router = express.Router();

router.use(redisRoutes);
router.use(rabbitRoutes);
router.use(postgresRoutes);
router.use(mongoRoutes);

module.exports = router;
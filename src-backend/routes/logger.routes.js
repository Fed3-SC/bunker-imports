'use strict';

const express = require('express');
const router = express.Router();
const loggerController = require('../controllers/logger.controller');

// Endpoint de diagnóstico para verificar que todos los niveles de Winston funcionan
router.get('/test', loggerController.test);

module.exports = router;

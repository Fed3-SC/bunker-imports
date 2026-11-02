'use strict';

const express = require('express');
const router = express.Router();
const mockController = require('../controllers/mock.controller');

// Generación de datos simulados en memoria (sin persistir)
router.get('/users', mockController.getUsers);
router.get('/couriers', mockController.getCouriers);
router.get('/orders', mockController.getOrders);
router.get('/deliveries', mockController.getDeliveries);

// Carga masiva controlada en base de datos (deshabilitada en producción)
router.post('/seed', mockController.seed);

module.exports = router;

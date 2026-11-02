'use strict';

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { ROLES } = require('../constants');

// Rutas públicas de autenticación
router.post('/register', userController.register);
router.post('/login', userController.login);

// Rutas autenticadas de usuario actual
router.get('/me', authenticate, userController.getCurrentUser);

// Rutas de administración de usuarios
router.get('/couriers', authenticate, authorize(ROLES.ADMIN, ROLES.EDITOR), userController.getCouriers);
router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.EDITOR), userController.getAll);
router.get('/:id', authenticate, userController.getById);
router.put('/:id', authenticate, userController.update);
router.delete('/:id', authenticate, authorize(ROLES.ADMIN), userController.remove);

module.exports = router;

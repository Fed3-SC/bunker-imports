'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config/env.config');
const CustomError = require('../errors/CustomError');
const userRepository = require('../repositories/user.repository');

async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new CustomError('UNAUTHORIZED', 'Token de acceso no proporcionado.');
    }

    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await userRepository.findById(decoded.id);

    if (!user || user.status !== 'active') {
      throw new CustomError('UNAUTHORIZED', 'Usuario inactivo o no encontrado.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

// Middleware opcional para endpoints que permiten tanto usuarios anónimos como registrados
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret);
      const user = await userRepository.findById(decoded.id);
      if (user && user.status === 'active') {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Si falla el token en ruta opcional, simplemente continúa como invitado
    next();
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new CustomError('UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new CustomError('FORBIDDEN'));
    }

    next();
  };
}

module.exports = {
  authenticate,
  optionalAuth,
  authorize
};

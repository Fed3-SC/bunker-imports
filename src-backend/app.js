'use strict';

const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes');
const swaggerSpec = require('./config/swagger.js');
const errorHandler = require('./middlewares/error.middleware');
const notFoundHandler = require('./middlewares/not-found.middleware');

const app = express();

// Middlewares de seguridad y parsing
app.use(helmet({
  contentSecurityPolicy: false, // Permite recursos externos (Google Fonts, FontAwesome) y scripts locales
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentación Swagger / OpenAPI
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas de la API REST
app.use('/api', routes);

// Servir archivos estáticos del frontend (tienda y panel administrativo)
const projectRoot = path.join(__dirname, '..');
app.use(express.static(projectRoot));

// Middleware para rutas inexistentes y middleware global de errores
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;

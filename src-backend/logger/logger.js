'use strict';

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const config = require('../config/env.config');

// Niveles personalizados para incluir "fatal" y "http"
const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red bold',
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
  }
};

winston.addColors(customLevels.colors);

// Formato base para consola (desarrollo)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

// Formato para archivos (JSON estructurado)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json()
);

// Transports de archivos con rotación diaria
const errorRotate = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  level: 'warning',
  maxSize: '10m',
  maxFiles: '14d',
  format: fileFormat
});

const combinedRotate = new DailyRotateFile({
  filename: 'logs/combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '7d',
  format: fileFormat
});

// Configuración según entorno
const transports = [];

if (config.isDev) {
  // Desarrollo: consola con debug
  transports.push(new winston.transports.Console({
    level: 'debug',
    format: consoleFormat
  }));
  transports.push(errorRotate);
  transports.push(combinedRotate);
} else if (config.isTest) {
  // Test: consola mínima, sin archivos
  transports.push(new winston.transports.Console({
    level: 'error',
    format: consoleFormat,
    silent: true // silenciar en tests para evitar ruido
  }));
} else {
  // Producción: info y superiores, con archivos
  transports.push(new winston.transports.Console({
    level: 'info',
    format: consoleFormat
  }));
  transports.push(errorRotate);
  transports.push(combinedRotate);
}

const logger = winston.createLogger({
  levels: customLevels.levels,
  transports
});

module.exports = logger;

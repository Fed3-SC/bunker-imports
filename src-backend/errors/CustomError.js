'use strict';

const ERROR_DICTIONARY = require('./error.dictionary');

class CustomError extends Error {
  /**
   * @param {string} codeOrMessage - Clave del ERROR_DICTIONARY o mensaje directo
   * @param {string} [customMessage] - Mensaje opcional para sobreescribir el del diccionario
   * @param {number} [customStatus] - Status HTTP opcional
   * @param {any} [details] - Detalles de validación adicionales
   */
  constructor(codeOrMessage, customMessage, customStatus, details = null) {
    const dictEntry = ERROR_DICTIONARY[codeOrMessage];

    if (dictEntry) {
      super(customMessage || dictEntry.message);
      this.code = dictEntry.code;
      this.statusCode = customStatus || dictEntry.status;
    } else {
      super(codeOrMessage || 'Error inesperado');
      this.code = 'CUSTOM_ERROR';
      this.statusCode = customStatus || 500;
    }

    this.details = details;
    this.name = 'CustomError';
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;

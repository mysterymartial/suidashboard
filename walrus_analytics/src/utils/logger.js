/**
 * Logger Utility
 * 
 * This module provides centralized logging functionality using Winston.
 * It configures different log levels and formats for development and production.
 * 
 * @author Og
 * @version 1.0.0
 */

// Import Winston logging library
const winston = require('winston');

// Import environment variables
require('dotenv').config();

/**
 * Define log levels and their colors
 * This helps with readability in console output
 */
const logLevels = {
  error: 0,   // Highest priority - errors only
  warn: 1,    // Warnings and errors
  info: 2,    // General information, warnings, and errors
  http: 3,    // HTTP requests, info, warnings, and errors
  debug: 4    // All logs including debug information
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Add colors to Winston
winston.addColors(logColors);

/**
 * Define log format for console output
 * This format includes timestamp, level, and message
 */
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`;
    }
    
    return log;
  })
);

/**
 * Define log format for file output
 * This format is more structured for log files
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Create Winston logger instance
 * Configure transports based on environment
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: fileFormat,
  defaultMeta: { service: 'sui-analytics-backend' },
  transports: [
    // Console transport for development
    new winston.transports.Console({
      format: consoleFormat
    }),
    
    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat
    }),
    
    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: fileFormat
    })
  ],
  
  // Handle uncaught exceptions
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  ],
  
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' })
  ]
});

/**
 * Create logs directory if it doesn't exist
 * This ensures log files can be written
 */
const fs = require('fs');
const path = require('path');

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Custom logging functions for different use cases
 * These provide convenient methods for common logging scenarios
 */
const customLogger = {
  /**
   * Log HTTP requests
   * @param {string} method - HTTP method
   * @param {string} url - Request URL
   * @param {number} statusCode - Response status code
   * @param {number} responseTime - Response time in milliseconds
   */
  http: (method, url, statusCode, responseTime) => {
    logger.http(`${method} ${url}`, {
      statusCode,
      responseTime: `${responseTime}ms`
    });
  },

  /**
   * Log API calls to external services
   * @param {string} service - Service name (e.g., 'Blockberry API')
   * @param {string} endpoint - API endpoint
   * @param {string} status - Success or error status
   * @param {Object} metadata - Additional metadata
   */
  api: (service, endpoint, status, metadata = {}) => {
    logger.info(`API Call: ${service} - ${endpoint}`, {
      service,
      endpoint,
      status,
      ...metadata
    });
  },

  /**
   * Log application errors
   * @param {Error} error - Error object
   * @param {string} context - Context where error occurred
   * @param {Object} metadata - Additional metadata
   */
  error: (error, context = 'Unknown', metadata = {}) => {
    logger.error(`Error in ${context}: ${error.message}`, {
      context,
      error: error.stack,
      ...metadata
    });
  },

  /**
   * Log application startup
   * @param {string} message - Startup message
   * @param {Object} metadata - Additional metadata
   */
  startup: (message, metadata = {}) => {
    logger.info(`🚀 ${message}`, {
      type: 'startup',
      ...metadata
    });
  },

  /**
   * Log application shutdown
   * @param {string} message - Shutdown message
   * @param {Object} metadata - Additional metadata
   */
  shutdown: (message, metadata = {}) => {
    logger.info(`🛑 ${message}`, {
      type: 'shutdown',
      ...metadata
    });
  }
};

// Export the logger and custom logging functions
module.exports = {
  logger,
  customLogger
};

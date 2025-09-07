/**
 * Sui Analytics Backend Server
 * 
 * This is the main entry point for the Sui analytics dashboard backend.
 * It sets up the Express server, middleware, routes, and error handling.
 * 
 * @author Og
 * @version 1.0.0
 */

// Import required modules
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import environment variables
require('dotenv').config();

// Import custom utilities
const { customLogger, logger } = require('./utils/logger');

// Import routes
const analyticsRoutes = require('./routes/analytics');

// Create Express application
const app = express();

// Get port from environment or use default
const PORT = process.env.PORT || 3000;

// Get environment (development, production, etc.)
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Middleware Configuration
 * These middleware functions process requests before they reach the route handlers
 */

// Enable CORS for frontend access
// This allows the frontend to make requests to this backend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Parse JSON bodies
// This middleware parses incoming JSON requests and makes them available in req.body
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies
// This middleware parses incoming form data and makes it available in req.body
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
// This logs all incoming requests for debugging and monitoring
app.use((req, res, next) => {
  const start = Date.now();
  
  // Log the incoming request
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  
  // Override res.end to log response details
  const originalEnd = res.end;
  res.end = function(...args) {
    const responseTime = Date.now() - start;
    customLogger.http(req.method, req.url, res.statusCode, responseTime);
    originalEnd.apply(this, args);
  };
  
  next();
});

/**
 * Route Configuration
 * These routes handle different API endpoints
 */

// Health check endpoint
// This endpoint provides basic server health information
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
    version: '1.0.0'
  });
});

// Root endpoint
// This provides basic API information
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sui Analytics Backend API',
    version: '1.0.0',
    description: 'Backend API for Sui analytics dashboard using Blockberry API',
    documentation: '/api/analytics',
    health: '/health',
    timestamp: new Date().toISOString()
  });
});

// Analytics API routes
// All analytics endpoints are prefixed with /api/analytics
app.use('/api/analytics', analyticsRoutes);

/**
 * Error Handling Middleware
 * These middleware functions handle errors that occur during request processing
 */

// 404 handler for undefined routes
// This catches requests to routes that don't exist
app.use('*', (req, res) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
// This catches any errors that occur during request processing
app.use((error, req, res, next) => {
  // Log the error
  customLogger.error(error, 'Global Error Handler', {
    url: req.url,
    method: req.method,
    ip: req.ip
  });
  
  // Send error response
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: NODE_ENV === 'development' ? error.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

/**
 * Graceful Shutdown Handling
 * This ensures the server shuts down gracefully when receiving termination signals
 */
process.on('SIGTERM', () => {
  customLogger.shutdown('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  customLogger.shutdown('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  customLogger.error(error, 'Uncaught Exception');
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  customLogger.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

/**
 * Server Startup
 * Start the server and log startup information
 */
const server = app.listen(PORT, () => {
  customLogger.startup(`Sui Analytics Backend Server started`, {
    port: PORT,
    environment: NODE_ENV,
    timestamp: new Date().toISOString()
  });
  
  console.log(`
🚀 Sui Analytics Backend Server
📊 Version: 1.0.0
🌍 Environment: ${NODE_ENV}
🔗 Server: http://localhost:${PORT}
📚 API Documentation: http://localhost:${PORT}/api/analytics
❤️  Health Check: http://localhost:${PORT}/health
  `);
});

// Export the app for testing purposes
module.exports = app;

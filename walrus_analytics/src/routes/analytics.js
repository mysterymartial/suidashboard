/**
 * Analytics Routes
 * 
 * This module defines all the API routes for analytics endpoints.
 * It connects the HTTP requests to the appropriate controller functions.
 * 
 * @author Og
 * @version 1.0.0
 */

// Import Express Router
const express = require('express');

// Import controller functions
const {
  getAvgBlobSize,
  getAccountsCount,
  getBlobsCount,
  healthCheck
} = require('../controllers/analyticsController');

// Import validation middleware
const {
  analyticsValidation,
  handleValidationErrors,
  validateApiKey
} = require('../middleware/validation');

// Create router instance
const router = express.Router();

/**
 * GET /api/analytics/avg-blob-size
 * 
 * Fetches average blob size chart data from Blockberry API
 * 
 * Query Parameters:
 * - period (optional): Time period for data (1H, 4H, 24H, 7D, 30D, 90D)
 * - size (optional): Widget size (SMALL, MEDIUM, LARGE)
 * - widgetPage (optional): Page context (HOME, DASHBOARD, ANALYTICS)
 * 
 * Example: GET /api/analytics/avg-blob-size?period=24H&size=SMALL&widgetPage=HOME
 * 
 * Response:
 * - 200: Success with chart data
 * - 400: Invalid parameters
 * - 500: Server error or API failure
 */
router.get('/avg-blob-size', 
  validateApiKey,           // Ensure API key is configured
  analyticsValidation,      // Validate query parameters
  handleValidationErrors,   // Handle validation errors
  getAvgBlobSize           // Controller function
);

/**
 * GET /api/analytics/accounts-count
 * 
 * Fetches accounts count chart data from Blockberry API
 * 
 * Query Parameters:
 * - period (optional): Time period for data (1H, 4H, 24H, 7D, 30D, 90D)
 * - size (optional): Widget size (SMALL, MEDIUM, LARGE)
 * - widgetPage (optional): Page context (HOME, DASHBOARD, ANALYTICS)
 * 
 * Example: GET /api/analytics/accounts-count?period=7D&size=MEDIUM&widgetPage=DASHBOARD
 * 
 * Response:
 * - 200: Success with chart data
 * - 400: Invalid parameters
 * - 500: Server error or API failure
 */
router.get('/accounts-count',
  validateApiKey,           // Ensure API key is configured
  analyticsValidation,      // Validate query parameters
  handleValidationErrors,   // Handle validation errors
  getAccountsCount         // Controller function
);

/**
 * GET /api/analytics/blobs-count
 * 
 * Fetches blobs count chart data from Blockberry API
 * 
 * Query Parameters:
 * - period (optional): Time period for data (1H, 4H, 24H, 7D, 30D, 90D)
 * - size (optional): Widget size (SMALL, MEDIUM, LARGE)
 * - widgetPage (optional): Page context (HOME, DASHBOARD, ANALYTICS)
 * 
 * Example: GET /api/analytics/blobs-count?period=30D&size=LARGE&widgetPage=ANALYTICS
 * 
 * Response:
 * - 200: Success with chart data
 * - 400: Invalid parameters
 * - 500: Server error or API failure
 */
router.get('/blobs-count',
  validateApiKey,           // Ensure API key is configured
  analyticsValidation,      // Validate query parameters
  handleValidationErrors,   // Handle validation errors
  getBlobsCount            // Controller function
);

/**
 * GET /api/analytics/health
 * 
 * Health check endpoint to verify API status and connectivity
 * 
 * Response:
 * - 200: API is healthy
 * - 503: API is unhealthy
 * - 500: Health check failed
 */
router.get('/health', healthCheck);

/**
 * GET /api/analytics/
 * 
 * Root analytics endpoint providing API information
 * 
 * Response:
 * - 200: API information and available endpoints
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sui Analytics API',
    version: '1.0.0',
    description: 'Backend API for Sui analytics dashboard using Blockberry API',
    endpoints: {
      'GET /api/analytics/avg-blob-size': 'Fetch average blob size chart data',
      'GET /api/analytics/accounts-count': 'Fetch accounts count chart data',
      'GET /api/analytics/blobs-count': 'Fetch blobs count chart data',
      'GET /api/analytics/health': 'Health check endpoint'
    },
    parameters: {
      period: 'Time period (1H, 4H, 24H, 7D, 30D, 90D)',
      size: 'Widget size (SMALL, MEDIUM, LARGE)',
      widgetPage: 'Page context (HOME, DASHBOARD, ANALYTICS)'
    },
    examples: {
      'Average blob size (24H)': '/api/analytics/avg-blob-size?period=24H',
      'Accounts count (7D, MEDIUM)': '/api/analytics/accounts-count?period=7D&size=MEDIUM',
      'Blobs count (30D, LARGE, DASHBOARD)': '/api/analytics/blobs-count?period=30D&size=LARGE&widgetPage=DASHBOARD'
    },
    timestamp: new Date().toISOString()
  });
});

// Export the router for use in the main application
module.exports = router;

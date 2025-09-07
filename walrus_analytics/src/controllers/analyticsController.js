/**
 * Analytics Controller
 * 
 * This controller handles all analytics-related API requests.
 * It acts as a bridge between the routes and the Blockberry API utility.
 * 
 * @author Og 
 * @version 1.0.0
 */

// Import the Blockberry utility functions
const blockberry = require('../utils/blockberry');


// Import validation and sanitization functions
const { validationResult } = require('express-validator');

/**
 * Handles GET request to fetch average blob size chart data
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with chart data or error
 */
async function getAvgBlobSize(req, res) {
  try {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: errors.array()
      });
    }

    // Extract query parameters with defaults
    const { period, size, widgetPage } = req.query;
    
    // Prepare options object for Blockberry API
    const options = {};
    if (period) options.period = period;
    if (size) options.size = size;
    if (widgetPage) options.widgetPage = widgetPage;

    // Log the incoming request for debugging
    console.log(`[Analytics Controller] Fetching average blob size chart for:`, options);

    // Call Blockberry API utility function
    const result = await blockberry.getAvgBlobSizeChart(options);

  //  const result = await blockberry.getAvgBlobSizeChart();

    // Send successful response
    res.status(200).json({
      success: true,
      message: 'Average blob size chart data retrieved successfully',
      data: result.data,
      timestamp: result.timestamp,
      parameters: options
    });

  } catch (error) {
    // Log the error for debugging
    console.error('[Analytics Controller] Error in getAvgBlobSize:', error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: 'Failed to fetch average blob size chart data',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Handles GET request to fetch accounts count chart data
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with chart data or error
 */
async function getAccountsCount(req, res) {
  try {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: errors.array()
      });
    }

    // Extract query parameters with defaults
    const { period, size, widgetPage } = req.query;
    
    // Prepare options object for Blockberry API
    const options = {};
    if (period) options.period = period;
    if (size) options.size = size;
    if (widgetPage) options.widgetPage = widgetPage;

    // Log the incoming request for debugging
    console.log(`[Analytics Controller] Fetching accounts count chart for:`, options);

    // Call Blockberry API utility function
    const result = await blockberry.getAccountsCountChart(options);

    // Send successful response
    res.status(200).json({
      success: true,
      message: 'Accounts count chart data retrieved successfully',
      data: result.data,
      timestamp: result.timestamp,
      parameters: options
    });

  } catch (error) {
    // Log the error for debugging
    console.error('[Analytics Controller] Error in getAccountsCount:', error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: 'Failed to fetch accounts count chart data',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Handles GET request to fetch blobs count chart data
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with chart data or error
 */
async function getBlobsCount(req, res) {
  try {
    // Check for validation errors from express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request parameters',
        errors: errors.array()
      });
    }

    // Extract query parameters with defaults
    const { period, size, widgetPage } = req.query;
    
    // Prepare options object for Blockberry API
    const options = {};
    if (period) options.period = period;
    if (size) options.size = size;
    if (widgetPage) options.widgetPage = widgetPage;

    // Log the incoming request for debugging
    console.log(`[Analytics Controller] Fetching blobs count chart for:`, options);

    // Call Blockberry API utility function
    const result = await blockberry.getBlobsCountChart(options);

    // Send successful response
    res.status(200).json({
      success: true,
      message: 'Blobs count chart data retrieved successfully',
      data: result.data,
      timestamp: result.timestamp,
      parameters: options
    });

  } catch (error) {
    // Log the error for debugging
    console.error('[Analytics Controller] Error in getBlobsCount:', error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blobs count chart data',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

/**
 * Health check endpoint to verify API status
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} Sends JSON response with health status
 */
async function healthCheck(req, res) {
  try {
    // Call Blockberry health check
    const result = await blockberry.healthCheck();

    // Send response based on health status
    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Analytics API is healthy',
        blockberry: result,
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(503).json({
        success: false,
        message: 'Analytics API is unhealthy',
        blockberry: result,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    // Log the error for debugging
    console.error('[Analytics Controller] Error in healthCheck:', error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: 'Health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}

// Export all controller functions
module.exports = {
  getAvgBlobSize,
  getAccountsCount,
  getBlobsCount,
  healthCheck
};

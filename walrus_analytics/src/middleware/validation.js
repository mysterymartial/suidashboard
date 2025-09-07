/**
 * Validation Middleware
 * 
 * This middleware provides input validation for API endpoints.
 * It uses express-validator to validate and sanitize query parameters.
 * 
 * @author Og
 * @version 1.0.0
 */

// Import express-validator functions
const { query, validationResult } = require('express-validator');

/**
 * Validation rules for analytics endpoints
 * These rules validate the query parameters for all analytics API calls
 */
const analyticsValidation = [
  // Validate period parameter
  query('period')
    .optional() // Make it optional since we have defaults
    .isIn(['1H', '4H', '24H', '7D', '30D', '90D']) // Allowed values
    .withMessage('Period must be one of: 1H, 4H, 24H, 7D, 30D, 90D')
    .trim() // Remove whitespace
    .escape(), // Escape HTML characters

  // Validate size parameter
  query('size')
    .optional() // Make it optional since we have defaults
    .isIn(['SMALL', 'MEDIUM', 'LARGE']) // Allowed values
    .withMessage('Size must be one of: SMALL, MEDIUM, LARGE')
    .trim() // Remove whitespace
    .escape(), // Escape HTML characters

  // Validate widgetPage parameter
  query('widgetPage')
    .optional() // Make it optional since we have defaults
    .isIn(['HOME', 'DASHBOARD', 'ANALYTICS']) // Allowed values
    .withMessage('WidgetPage must be one of: HOME, DASHBOARD, ANALYTICS')
    .trim() // Remove whitespace
    .escape(), // Escape HTML characters
];

/**
 * Middleware to handle validation errors
 * This should be used after the validation rules
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function handleValidationErrors(req, res, next) {
  // Get validation errors
  const errors = validationResult(req);
  
  // If there are validation errors, return them
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  // If no errors, continue to the next middleware
  next();
}

/**
 * Custom validation for API key presence
 * This ensures the API key is configured before making requests
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
function validateApiKey(req, res, next) {
  // Check if API key is configured
  if (!process.env.BLOCKBERRY_API_KEY || process.env.BLOCKBERRY_API_KEY === 'your_api_key_here') {
    return res.status(500).json({
      success: false,
      message: 'API key not configured. Please check your .env file.',
      error: 'BLOCKBERRY_API_KEY is missing or not properly set'
    });
  }
  
  // If API key is configured, continue
  next();
}

// Export validation rules and middleware
module.exports = {
  analyticsValidation,
  handleValidationErrors,
  validateApiKey
};

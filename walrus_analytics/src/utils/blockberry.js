/**
 * Blockberry API Utility Module
 * 
 * This module handles all interactions with the Blockberry API.
 * It provides a clean interface for fetching analytics data from the Sui blockchain.
 * 
 * @author Og
 * @version 1.0.0
 */

// Import the Blockberry API client
// Note: This import will work after running: npx api install "@blockberry/v1.0#v3cjoomckkvyl7"
// For testing purposes, we'll use a mock version
let blockberry;
try {
  blockberry = require('@api/blockberry');
  blockberry.auth('uRQ2FafmcegmCzOGJVZ6qWHiMKyK1a')
} catch (error) {
  console.log('Blockberry API not installed, using mock version for testing');
  blockberry = require('./blockberry-mock');
}

// Import environment variables
require('dotenv').config();


/**
 * Configuration object for Blockberry API
 * Contains default values and API key setup
 */
const config = {
  // API key from environment variables
  apiKey: process.env.BLOCKBERRY_API_KEY,
  
  // Default parameters for API calls
  defaults: {
    period: '24H',      // Time period for data
    size: 'SMALL',      // Widget size
    widgetPage: 'HOME', // Page context
    accept: '*/*'       // Accept header
  }
};

/**
 * Validates that the API key is configured
 * @throws {Error} If API key is missing
 */
function validateApiKey() {
  if (!config.apiKey || config.apiKey === 'your_api_key_here') {
    throw new Error('BLOCKBERRY_API_KEY is not configured. Please check your .env file.');
  }
}

/**
 * Merges default parameters with provided parameters
 * @param {Object} params - Parameters provided by the user
 * @returns {Object} Merged parameters with defaults
 */
function mergeWithDefaults(params = {}) {
  return {
    ...config.defaults,
    ...params
  };
}

/**
 * Transforms Blockberry API response to our expected chart format
 * @param {Object} blockberryData - Raw data from Blockberry API
 * @returns {Object} Transformed data in chart format
 */
function transformBlockberryResponse(blockberryData) {
  // Extract chart data from the response
  const chartData = blockberryData.chart || [];
  
  // Transform timestamps to readable time labels
  const labels = chartData.map(item => {
    const date = new Date(item.timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  });
  
  // Extract values
  const data = chartData.map(item => item.value);
  
  return {
    labels: labels,
    datasets: [{
      label: 'Value',
      data: data,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)'
    }],
    // Include additional metadata from Blockberry
    metadata: {
      value: blockberryData.value,
      changeValue: blockberryData.changeValue,
      changePercent: blockberryData.changePercent,
      changePeriod: blockberryData.changePeriod
    }
  };
}

/**
 * Fetches average blob size chart data from Blockberry API
 * 
 * @param {Object} options - Query parameters
 * @param {string} options.period - Time period (e.g., '24H', '7D', '30D')
 * @param {string} options.size - Widget size (e.g., 'SMALL', 'MEDIUM', 'LARGE')
 * @param {string} options.widgetPage - Page context (e.g., 'HOME', 'DASHBOARD')
 * @returns {Promise<Object>} Chart data from Blockberry API
 * @throws {Error} If API call fails or API key is missing
 */
async function getAvgBlobSizeChart(options = {}) {
  try {
    // Validate API key before making the call
    validateApiKey();
    
    // Merge user options with defaults
    const params = mergeWithDefaults(options);
    
    console.log('Fetching average blob size chart with params:', params);
    
    // Make API call using async/await for better readability
    const response = await blockberry.getAvgBlobSizeChart(params);
    
    // Transform the response to match our expected format
    const transformedData = transformBlockberryResponse(response.data);
    
    return {
      success: true,
      data: transformedData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching average blob size chart:', error.message);
    throw new Error(`Failed to fetch average blob size chart: ${error.message}`);
  }
}

/**
 * Fetches accounts count chart data from Blockberry API
 * 
 * @param {Object} options - Query parameters
 * @param {string} options.period - Time period (e.g., '24H', '7D', '30D')
 * @param {string} options.size - Widget size (e.g., 'SMALL', 'MEDIUM', 'LARGE')
 * @param {string} options.widgetPage - Page context (e.g., 'HOME', 'DASHBOARD')
 * @returns {Promise<Object>} Chart data from Blockberry API
 * @throws {Error} If API call fails or API key is missing
 */
async function getAccountsCountChart(options = {}) {
  try {
    // Validate API key before making the call
    validateApiKey();
    
    // Merge user options with defaults
    const params = mergeWithDefaults(options);
    
    console.log('Fetching accounts count chart with params:', params);
    
    // Make API call using async/await for better readability
    const response = await blockberry.getAccountsCountChart(params);
    
    // Transform the response to match our expected format
    const transformedData = transformBlockberryResponse(response.data);
    
    return {
      success: true,
      data: transformedData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching accounts count chart:', error.message);
    throw new Error(`Failed to fetch accounts count chart: ${error.message}`);
  }
}

/**
 * Fetches blobs count chart data from Blockberry API
 * 
 * @param {Object} options - Query parameters
 * @param {string} options.period - Time period (e.g., '24H', '7D', '30D')
 * @param {string} options.size - Widget size (e.g., 'SMALL', 'MEDIUM', 'LARGE')
 * @param {string} options.widgetPage - Page context (e.g., 'HOME', 'DASHBOARD')
 * @returns {Promise<Object>} Chart data from Blockberry API
 * @throws {Error} If API call fails or API key is missing
 */
async function getBlobsCountChart(options = {}) {
  try {
    // Validate API key before making the call
    validateApiKey();
    
    // Merge user options with defaults
    const params = mergeWithDefaults(options);
    
    console.log('Fetching blobs count chart with params:', params);
    
    // Make API call using async/await for better readability
    const response = await blockberry.getBlobsCountChart(params);
    
    // Transform the response to match our expected format
    const transformedData = transformBlockberryResponse(response.data);
    
    return {
      success: true,
      data: transformedData,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching blobs count chart:', error.message);
    throw new Error(`Failed to fetch blobs count chart: ${error.message}`);
  }
}

/**
 * Health check function to verify API connectivity
 * @returns {Promise<Object>} Health status
 */
async function healthCheck() {
  try {
    validateApiKey();
    return {
      success: true,
      message: 'Blockberry API is configured and ready',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

// Export all functions for use in other modules
module.exports = {
  getAvgBlobSizeChart,
  getAccountsCountChart,
  getBlobsCountChart,
  healthCheck,
  config
};

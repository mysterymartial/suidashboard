/**
 * Simple API Test Script
 * 
 * This script demonstrates how to use the Sui Analytics Backend API.
 * Run this script to test all endpoints and see example responses.
 * 
 * Usage: node test-api.js
 */

const http = require('http');

// Configuration
const BASE_URL = 'http://localhost:3001';
const ENDPOINTS = [
  '/health',
  '/api/analytics',
  '/api/analytics/avg-blob-size?period=24H&size=SMALL',
  '/api/analytics/accounts-count?period=7D&size=MEDIUM',
  '/api/analytics/blobs-count?period=30D&size=LARGE&widgetPage=DASHBOARD',
  '/api/analytics/health'
];

/**
 * Make HTTP request and return promise
 */
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            data: jsonData
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Test all endpoints
 */
async function testEndpoints() {
  console.log('🚀 Testing Sui Analytics Backend API\n');
  console.log('=' .repeat(60));
  
  for (const endpoint of ENDPOINTS) {
    const url = `${BASE_URL}${endpoint}`;
    
    try {
      console.log(`\n📡 Testing: ${endpoint}`);
      console.log('-'.repeat(40));
      
      const response = await makeRequest(url);
      
      console.log(`Status: ${response.status}`);
      console.log('Response:');
      console.log(JSON.stringify(response.data, null, 2));
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ API testing completed!');
}

/**
 * Test validation errors
 */
async function testValidation() {
  console.log('\n🔍 Testing validation errors...\n');
  
  const invalidEndpoints = [
    '/api/analytics/avg-blob-size?period=INVALID',
    '/api/analytics/accounts-count?size=WRONG',
    '/api/analytics/blobs-count?widgetPage=INVALID'
  ];
  
  for (const endpoint of invalidEndpoints) {
    const url = `${BASE_URL}${endpoint}`;
    
    try {
      console.log(`Testing invalid endpoint: ${endpoint}`);
      const response = await makeRequest(url);
      console.log(`Status: ${response.status}`);
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
    console.log('-'.repeat(40));
  }
}

// Run tests
async function runTests() {
  try {
    await testEndpoints();
    await testValidation();
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Check if server is running
async function checkServer() {
  try {
    await makeRequest(`${BASE_URL}/health`);
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking if server is running...');
  
  const isRunning = await checkServer();
  if (!isRunning) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   node src/index.js');
    process.exit(1);
  }
  
  console.log('✅ Server is running. Starting tests...\n');
  await runTests();
}

// Run the tests
main().catch(console.error);

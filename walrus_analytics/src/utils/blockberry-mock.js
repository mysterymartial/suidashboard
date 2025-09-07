/**
 * Mock Blockberry API Utility Module
 * 
 * This is a mock version of the Blockberry API for testing purposes.
 * It simulates the API responses without making actual external calls.
 * 
 * @author Og
 * @version 1.0.0
 */

// Mock data for testing - matches Blockberry API format
const mockData = {
  avgBlobSize: {
    value: 182352.0,
    changeValue: 1779.0,
    changePercent: null,
    additionalValue: null,
    maxRate: null,
    changeRate: null,
    changePeriod: "24H",
    noChanges: false,
    chart: [
      { value: 73.0, timestamp: 1757118369036 },
      { value: 78.0, timestamp: 1757121969036 },
      { value: 141.0, timestamp: 1757125569036 },
      { value: 231.0, timestamp: 1757129169036 },
      { value: 174.0, timestamp: 1757132769036 },
      { value: 55.0, timestamp: 1757136369036 }
    ]
  },
  accountsCount: {
    value: 125000.0,
    changeValue: 2500.0,
    changePercent: 2.0,
    additionalValue: null,
    maxRate: null,
    changeRate: null,
    changePeriod: "24H",
    noChanges: false,
    chart: [
      { value: 1250, timestamp: 1757118369036 },
      { value: 1356, timestamp: 1757121969036 },
      { value: 1289, timestamp: 1757125569036 },
      { value: 1434, timestamp: 1757129169036 },
      { value: 1387, timestamp: 1757132769036 },
      { value: 1405, timestamp: 1757136369036 }
    ]
  },
  blobsCount: {
    value: 85000.0,
    changeValue: 1200.0,
    changePercent: 1.4,
    additionalValue: null,
    maxRate: null,
    changeRate: null,
    changePeriod: "24H",
    noChanges: false,
    chart: [
      { value: 850, timestamp: 1757118369036 },
      { value: 956, timestamp: 1757121969036 },
      { value: 889, timestamp: 1757125569036 },
      { value: 1034, timestamp: 1757129169036 },
      { value: 987, timestamp: 1757132769036 },
      { value: 1005, timestamp: 1757136369036 }
    ]
  }
};

/**
 * Simulates API delay
 * @param {number} ms - Delay in milliseconds
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mock function for getAvgBlobSizeChart
 */
async function getAvgBlobSizeChart(options = {}) {
  console.log('Mock: Fetching average blob size chart with params:', options);
  await delay(100); // Simulate API delay
  
  return {
    success: true,
    data: mockData.avgBlobSize,
    timestamp: new Date().toISOString()
  };
}

/**
 * Mock function for getAccountsCountChart
 */
async function getAccountsCountChart(options = {}) {
  console.log('Mock: Fetching accounts count chart with params:', options);
  await delay(100); // Simulate API delay
  
  return {
    success: true,
    data: mockData.accountsCount,
    timestamp: new Date().toISOString()
  };
}

/**
 * Mock function for getBlobsCountChart
 */
async function getBlobsCountChart(options = {}) {
  console.log('Mock: Fetching blobs count chart with params:', options);
  await delay(100); // Simulate API delay
  
  return {
    success: true,
    data: mockData.blobsCount,
    timestamp: new Date().toISOString()
  };
}

/**
 * Mock health check function
 */
async function healthCheck() {
  return {
    success: true,
    message: 'Mock Blockberry API is ready',
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  getAvgBlobSizeChart,
  getAccountsCountChart,
  getBlobsCountChart,
  healthCheck
};

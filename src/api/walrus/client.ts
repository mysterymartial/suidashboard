import type { 
  PriceAndMarketCap, 
  WalrusOverviewData, 
  StorageCostsResponse,
  WalrusBlob,
  BlobEvent,
  StakingOperation,
  OperatorInteraction,
  BlobLifetime
} from './types';
import { BlobEventType } from './types';

export async function fetchWALPrice(apiKey?: string): Promise<PriceAndMarketCap> {
const finalApiKey = apiKey ?? (import.meta as any).env?.VITE_INSIDEX_API_KEY;
const response = await fetch(
"https://api-ex.insidex.trade/coins/0x356a26eb9e012a68958082340d4c4116e7f55615cf27affcff209cf0ae544f59::wal::WAL/price-and-mc",
{
headers: finalApiKey ? { 'x-api-key': finalApiKey } : {}
}
);

if (!response.ok) {
throw new Error(`Failed to fetch WAL price: ${response.status} ${response.statusText}`);
}

const data = await response.json();
return {
marketCap: data.marketCap,
price: data.price,
supply: data.supply,
};
}

const mockWalrusData: WalrusOverviewData = {
walTokenPrice: 0.00432669,
marketCap: 0,
totalSupply: 5000000000,
networkStats: {
storageUtilization: 18.563768774476802,
usedCapacityTB: 773.4903656032,
totalCapacityPB: 4.166666666666666,
storagePools: '123'
},
networkConfig: {
currentEpoch: 10,
epochDurationHours: 336,
nShards: 1000
},
storagePricing: {
storagePricePerMB: '11000',
writePricePerMB: '20000'
},
storageCostCalculator: {
amount: 100,
unit: 'GB',
costs: [
{
period: '1 WEEK',
epochs: 0.5,
costWAL: 0.1832,
costUSD: 0.000793,
storageCost: 0.1832,
writeCost: 2.0
},
{
period: '1 MONTH',
epochs: 2.14,
costWAL: 0.7864,
costUSD: 0.003402,
storageCost: 0.7864,
writeCost: 2.0
},
{
period: '1 YEAR',
epochs: 26.07,
costWAL: 9.5754,
costUSD: 0.041434,
storageCost: 9.5754,
writeCost: 2.0
}
]
},
lastUpdated: new Date().toISOString(),
fromCache: false,
stale: false
};

export async function fetchWalrusOverviewData(amount: number = 100, unit: string = 'GB'): Promise<WalrusOverviewData> {
try {
const response = await fetch('https://walrus5-gucco4za.b4a.run/api/walrus/overview-cached', {
method: 'GET',
headers: { 'Content-Type': 'application/json' },
signal: AbortSignal.timeout(10000)
});

if (!response.ok) {
throw new Error(`Failed to fetch Walrus overview data: ${response.status} ${response.statusText}`);
}

return await response.json();
} catch (error) {
console.warn('External Walrus API unavailable, using mock data:', error);
return {
...mockWalrusData,
storageCostCalculator: {
...mockWalrusData.storageCostCalculator,
amount,
unit
}
};
}
}

// Mock data for blobs owned by a user
const mockBlobs: WalrusBlob[] = [
  {
    id: 'blob-001',
    owner: '0x123abc',
    size: 1024 * 1024 * 5, // 5MB
    createdAt: '2023-10-15T14:30:00Z',
    expiresAt: '2024-10-15T14:30:00Z',
    status: 'active',
    contentType: 'image/jpeg',
    name: 'vacation-photo.jpg',
    description: 'Vacation photo from Hawaii',
    tags: ['vacation', 'photo', 'personal']
  },
  {
    id: 'blob-002',
    owner: '0x123abc',
    size: 1024 * 1024 * 20, // 20MB
    createdAt: '2023-11-05T09:15:00Z',
    expiresAt: '2024-11-05T09:15:00Z',
    status: 'active',
    contentType: 'application/pdf',
    name: 'research-paper.pdf',
    description: 'Blockchain research paper',
    tags: ['research', 'blockchain', 'academic']
  },
  {
    id: 'blob-003',
    owner: '0x123abc',
    size: 1024 * 1024 * 100, // 100MB
    createdAt: '2023-09-20T11:45:00Z',
    expiresAt: '2023-12-20T11:45:00Z',
    status: 'expired',
    contentType: 'video/mp4',
    name: 'demo-video.mp4',
    description: 'Product demo video',
    tags: ['demo', 'product', 'marketing']
  },
  {
    id: 'blob-004',
    owner: '0x123abc',
    size: 1024 * 1024 * 2, // 2MB
    createdAt: '2023-12-01T16:20:00Z',
    expiresAt: '2024-12-01T16:20:00Z',
    status: 'active',
    contentType: 'text/plain',
    name: 'notes.txt',
    description: 'Personal notes',
    tags: ['notes', 'personal']
  },
  {
    id: 'blob-005',
    owner: '0x123abc',
    size: 1024 * 1024 * 50, // 50MB
    createdAt: '2024-01-10T08:00:00Z',
    expiresAt: '2025-01-10T08:00:00Z',
    status: 'active',
    contentType: 'application/zip',
    name: 'project-backup.zip',
    description: 'Project backup files',
    tags: ['backup', 'project', 'work']
  }
];

// Mock data for blob events
const mockBlobEvents: BlobEvent[] = [
  {
    id: 'event-001',
    blobId: 'blob-001',
    type: BlobEventType.UPLOAD,
    timestamp: '2023-10-15T14:30:00Z',
    data: { size: 1024 * 1024 * 5, contentType: 'image/jpeg' }
  },
  {
    id: 'event-002',
    blobId: 'blob-001',
    type: BlobEventType.CERTIFICATION,
    timestamp: '2023-10-15T14:35:00Z',
    data: { certifier: '0xoperator1', status: 'certified' }
  },
  {
    id: 'event-003',
    blobId: 'blob-002',
    type: BlobEventType.UPLOAD,
    timestamp: '2023-11-05T09:15:00Z',
    data: { size: 1024 * 1024 * 20, contentType: 'application/pdf' }
  },
  {
    id: 'event-004',
    blobId: 'blob-003',
    type: BlobEventType.UPLOAD,
    timestamp: '2023-09-20T11:45:00Z',
    data: { size: 1024 * 1024 * 100, contentType: 'video/mp4' }
  },
  {
    id: 'event-005',
    blobId: 'blob-003',
    type: BlobEventType.EXPIRATION,
    timestamp: '2023-12-20T11:45:00Z',
    data: { reason: 'time_expired' }
  },
  {
    id: 'event-006',
    blobId: 'blob-004',
    type: BlobEventType.UPLOAD,
    timestamp: '2023-12-01T16:20:00Z',
    data: { size: 1024 * 1024 * 2, contentType: 'text/plain' }
  },
  {
    id: 'event-007',
    blobId: 'blob-005',
    type: BlobEventType.UPLOAD,
    timestamp: '2024-01-10T08:00:00Z',
    data: { size: 1024 * 1024 * 50, contentType: 'application/zip' }
  },
  {
    id: 'event-008',
    blobId: 'blob-005',
    type: BlobEventType.CERTIFICATION,
    timestamp: '2024-01-10T08:10:00Z',
    data: { certifier: '0xoperator2', status: 'certified' }
  }
];

// Mock data for staking operations
const mockStakingOperations: StakingOperation[] = [
  {
    id: 'stake-001',
    account: '0x123abc456def789',
    type: 'stake',
    amount: 1000,
    timestamp: '2023-09-01T10:00:00Z',
    transactionId: '0xijk901lmn234',
    status: 'completed'
  },
  {
    id: 'stake-002',
    account: '0x123abc456def789',
    type: 'stake',
    amount: 500,
    timestamp: '2023-10-05T14:30:00Z',
    transactionId: '0xjkl012mno345',
    status: 'completed'
  },
  {
    id: 'stake-003',
    account: '0x123abc456def789',
    type: 'unstake',
    amount: 200,
    timestamp: '2023-11-10T09:15:00Z',
    transactionId: '0xklm123nop456',
    status: 'completed'
  },
  {
    id: 'stake-004',
    account: '0x123abc456def789',
    type: 'stake',
    amount: 50,
    timestamp: '2023-12-15T16:45:00Z',
    transactionId: '0xlmn234opq567',
    status: 'completed'
  },
  {
    id: 'stake-005',
    account: '0x123abc456def789',
    type: 'stake',
    amount: 300,
    timestamp: '2024-01-20T11:30:00Z',
    transactionId: '0xmno345pqr678',
    status: 'pending'
  }
];

// Mock data for operator interactions
const mockOperatorInteractions: OperatorInteraction[] = [
  {
    id: 'op-001',
    account: '0x123abc456def789',
    operatorId: '0xoperator1',
    operatorName: 'Operator One',
    type: 'delegation',
    amount: 800,
    timestamp: '2023-09-02T11:00:00Z',
    status: 'completed'
  },
  {
    id: 'op-002',
    account: '0x123abc456def789',
    operatorId: '0xoperator2',
    operatorName: 'Operator Two',
    type: 'delegation',
    amount: 700,
    timestamp: '2023-10-06T15:30:00Z',
    status: 'completed'
  },
  {
    id: 'op-003',
    account: '0x123abc456def789',
    operatorId: '0xoperator1',
    operatorName: 'Operator One',
    type: 'undelegation',
    amount: 200,
    timestamp: '2023-11-11T10:15:00Z',
    status: 'completed'
  },
  {
    id: 'op-004',
    account: '0x123abc456def789',
    operatorId: '0xoperator1',
    operatorName: 'Operator One',
    type: 'reward',
    amount: 30,
    timestamp: '2023-12-16T17:45:00Z',
    status: 'completed'
  },
  {
    id: 'op-005',
    account: '0x123abc456def789',
    operatorId: '0xoperator2',
    operatorName: 'Operator Two',
    type: 'reward',
    amount: 25,
    timestamp: '2024-01-21T12:30:00Z',
    status: 'completed'
  }
];

// Mock data for blob lifetimes
const mockBlobLifetimes: Record<string, BlobLifetime> = {
  'blob-001': {
    blobId: 'blob-001',
    createdAt: '2023-10-15T14:30:00Z',
    expiresAt: '2024-10-15T14:30:00Z',
    isAutoRenewalEnabled: false,
    renewalHistory: []
  },
  'blob-002': {
    blobId: 'blob-002',
    createdAt: '2023-11-05T09:15:00Z',
    expiresAt: '2024-11-05T09:15:00Z',
    isAutoRenewalEnabled: true,
    renewalHistory: []
  },
  'blob-003': {
    blobId: 'blob-003',
    createdAt: '2023-09-20T11:45:00Z',
    expiresAt: '2023-12-20T11:45:00Z',
    isAutoRenewalEnabled: false,
    renewalHistory: []
  },
  'blob-004': {
    blobId: 'blob-004',
    createdAt: '2023-12-01T16:20:00Z',
    expiresAt: '2024-12-01T16:20:00Z',
    isAutoRenewalEnabled: true,
    renewalHistory: []
  },
  'blob-005': {
    blobId: 'blob-005',
    createdAt: '2024-01-10T08:00:00Z',
    expiresAt: '2025-01-10T08:00:00Z',
    isAutoRenewalEnabled: false,
    renewalHistory: []
  }
};

// API functions for blob and staking data

// This function is replaced by fetchAccountBlobs

// This function is replaced by the new fetchBlobEvents implementation below

// This function is replaced by the new fetchStakingOperations implementation below

// This function is replaced by the new fetchOperatorInteractions implementation below


/**
 * Fetch blobs owned by a specific account
 * @param account The account address
 * @returns Promise<WalrusBlob[]> Array of blobs owned by the account
 */
export const fetchAccountBlobs = async (account: string): Promise<WalrusBlob[]> => {
  try {
    // In a real implementation, this would make an API call to fetch the blobs
    // For now, we'll return mock data
    console.log(`Fetching blobs for account: ${account}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data filtered by account
    return mockBlobs.filter(blob => blob.owner === account);
  } catch (error) {
    console.error('Error fetching account blobs:', error);
    throw error;
  }
};

export const fetchUserBlobs = fetchAccountBlobs;

/**
 * Fetch events related to a specific blob
 * @param blobId The blob ID
 * @returns Promise<BlobEvent[]> Array of events for the blob
 */
export const fetchBlobEvents = async (blobId: string): Promise<BlobEvent[]> => {
  try {
    // In a real implementation, this would make an API call to fetch the events
    // For now, we'll return mock data
    console.log(`Fetching events for blob: ${blobId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data filtered by blobId
    return mockBlobEvents.filter(event => event.blobId === blobId);
  } catch (error) {
    console.error('Error fetching blob events:', error);
    throw error;
  }
};

/**
 * Fetch all blob events for an account
 * @param account The account address
 * @returns Promise<BlobEvent[]> Array of blob events
 */
export const fetchAccountBlobEvents = async (account: string): Promise<BlobEvent[]> => {
  try {
    console.log(`Fetching all blob events for account: ${account}`);
    
    // First get all blobs owned by the account
    const blobs = await fetchAccountBlobs(account);
    const blobIds = blobs.map(blob => blob.id);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Then get all events for those blobs
    return mockBlobEvents.filter(event => blobIds.includes(event.blobId));
  } catch (error) {
    console.error('Error fetching account blob events:', error);
    throw error;
  }
};

/**
 * Fetch staking operations for a specific account
 * @param account The account address
 * @returns Promise<StakingOperation[]> Array of staking operations for the account
 */
export const fetchStakingOperations = async (account: string): Promise<StakingOperation[]> => {
  try {
    // In a real implementation, this would make an API call to fetch the staking operations
    // For now, we'll return mock data
    console.log(`Fetching staking operations for account: ${account}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data filtered by account
    return mockStakingOperations.filter(op => op.account === account);
  } catch (error) {
    console.error('Error fetching staking operations:', error);
    throw error;
  }
};

/**
 * Fetch operator interactions for a specific account
 * @param account The account address
 * @returns Promise<OperatorInteraction[]> Array of operator interactions for the account
 */
export const fetchOperatorInteractions = async (account: string): Promise<OperatorInteraction[]> => {
  try {
    // In a real implementation, this would make an API call to fetch the operator interactions
    // For now, we'll return mock data
    console.log(`Fetching operator interactions for account: ${account}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data filtered by account
    return mockOperatorInteractions.filter(op => op.account === account);
  } catch (error) {
    console.error('Error fetching operator interactions:', error);
    throw error;
  }
};

/**
 * Fetch lifetime information for a specific blob
 * @param blobId The blob ID
 * @returns Promise<BlobLifetime | null> Lifetime information for the blob
 */
export const fetchBlobLifetime = async (blobId: string): Promise<BlobLifetime | null> => {
  try {
    // In a real implementation, this would make an API call to fetch the blob lifetime
    // For now, we'll return mock data
    console.log(`Fetching lifetime for blob: ${blobId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
      // Return mock data for the specified blobId
  const lifetime = mockBlobLifetimes[blobId];
  return lifetime ?? null;
  } catch (error) {
    console.error('Error fetching blob lifetime:', error);
    throw error;
  }
};

/**
 * Calculate storage costs for a given amount and unit
 * @param amount The amount of storage
 * @param unit The unit of storage (KB, MB, GB, TB)
 * @returns Storage costs response
 */

export async function calculateWalrusData() {
const data = await fetchWalrusOverviewData();
const storagePriceFrostPerByte = parseInt(data.storagePricing.storagePricePerMB) * 1000000;
const writePriceFrostPerByte = parseInt(data.storagePricing.writePricePerMB) * 1000000;
const usedCapacityBytes = data.networkStats.usedCapacityTB * 1000 * 1000 * 1000 * 1000;
const epochDurationMs = data.networkConfig.epochDurationHours * 60 * 60 * 1000;

return {
storagePriceFrostPerByte,
writePriceFrostPerByte,
usedCapacityBytes,
epochDurationMs
};
}

export async function calculateStorageCosts(
walPriceUSD: number,
sizeInBytes: number = 1024 * 1024,
amount?: number,
unit?: string
) {
let apiAmount = amount;
let apiUnit = unit;

if (!apiAmount || !apiUnit) {
if (sizeInBytes >= 1000 * 1000 * 1000 * 1000) {
apiAmount = sizeInBytes / (1000 * 1000 * 1000 * 1000);
apiUnit = 'TB';
} else if (sizeInBytes >= 1000 * 1000 * 1000) {
apiAmount = sizeInBytes / (1000 * 1000 * 1000);
apiUnit = 'GB';
} else {
apiAmount = sizeInBytes / (1000 * 1000);
apiUnit = 'MB';
}
}

try {
const response = await fetch(`/api/walrus/storage-costs?size=${apiAmount}&unit=${apiUnit}`);
if (!response.ok) {
throw new Error(`Failed to fetch storage costs: ${response.status} ${response.statusText}`);
}
const data: StorageCostsResponse = await response.json();
if (!data.success) {
throw new Error(data.error || 'Failed to calculate storage costs');
}

const costs = [
{
period: '1 EPOCH (14 days)',
epochs: 1,
costWAL: data.costs.oneEpoch,
costUSD: data.costs.oneEpoch * walPriceUSD,
storageCost: data.costs.oneEpoch,
writeCost: 0
},
{
period: '1 MONTH',
epochs: 2.14,
costWAL: data.costs.oneMonth,
costUSD: data.costs.oneMonth * walPriceUSD,
storageCost: data.costs.oneMonth,
writeCost: 0
},
{
period: '1 YEAR',
epochs: 26.07,
costWAL: data.costs.oneYear,
costUSD: data.costs.oneYear * walPriceUSD,
storageCost: data.costs.oneYear,
writeCost: 0
}
];
return costs;
} catch (error) {
console.warn('Storage costs API unavailable, using mock data:', error);
const mockData = await fetchWalrusOverviewData(apiAmount!, apiUnit!);
return mockData.storageCostCalculator.costs.filter(cost => cost.period !== '1 DAY');
}
}

export default {
fetchWALPrice,
fetchWalrusOverviewData,
calculateWalrusData,
calculateStorageCosts
};

import type { PriceAndMarketCap, WalrusOverviewData, StorageCostsResponse } from './types';

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

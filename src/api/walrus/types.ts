export interface WalrusOverviewData {
walTokenPrice: number;
marketCap: number;
totalSupply: number;
networkStats: {
storageUtilization: number;
usedCapacityTB: number;
totalCapacityPB: number;
storagePools: string;
};
networkConfig: {
currentEpoch: number;
epochDurationHours: number;
nShards: number;
};
storagePricing: {
storagePricePerMB: string;
writePricePerMB: string;
};
storageCostCalculator: {
amount: number;
unit: string;
costs: Array<{
period: string;
epochs: number;
costWAL: number;
costUSD: number;
storageCost: number;
writeCost: number;
}>;
};
lastUpdated: string;
fromCache: boolean;
stale: boolean;
}

export type PriceAndMarketCap = {
marketCap: number;
price: number;
supply: number;
};

export interface StorageCostsResponse {
success: boolean;
input: {
size: number;
unit: string;
};
costs: {
oneDay: number;
oneEpoch: number;
oneMonth: number;
oneYear: number;
};
currency: string;
note: string;
error?: string;
}

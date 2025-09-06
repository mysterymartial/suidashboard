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

export interface WalrusBlob {
  id: string;
  owner: string;
  size: number;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'pending';
  contentType?: string;
  name?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export enum BlobEventType {
  UPLOAD = 'upload',
  CERTIFICATION = 'certification',
  EXPIRATION = 'expiration',
  RENEWAL = 'renewal'
}

export interface BlobEvent {
  id: string;
  blobId: string;
  type: BlobEventType;
  timestamp: string;
  data?: Record<string, any>;
}

export interface StakingOperation {
  id: string;
  account: string;
  amount: number;
  type: 'stake' | 'unstake';
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
}

export interface OperatorInteraction {
  id: string;
  account: string;
  operatorId: string;
  operatorName?: string;
  type: 'delegation' | 'undelegation' | 'reward';
  amount?: number;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface BlobLifetime {
  blobId: string;
  createdAt: string;
  expiresAt: string;
  renewalHistory: Array<{
    timestamp: string;
    extendedUntil: string;
    cost: number;
  }>;
  isAutoRenewalEnabled: boolean;
}

// Blob related types
export interface WalrusBlob {
  id: string;
  owner: string;
  size: number;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'pending';
  contentType?: string;
  name?: string;
  description?: string;
  tags?: string[];
}

export interface WalrusBlobEvent {
  id: string;
  blobId: string;
  eventType: 'upload' | 'certification' | 'expiration' | 'renewal';
  timestamp: string;
  data: Record<string, any>;
  txHash?: string;
}

// Staking related types
export interface WalrusStakingOperation {
  id: string;
  user: string;
  operationType: 'stake' | 'unstake' | 'claim';
  amount: number;
  timestamp: string;
  txHash: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface WalrusOperatorInteraction {
  id: string;
  user: string;
  operator: string;
  interactionType: 'delegate' | 'undelegate' | 'reward';
  amount?: number;
  timestamp: string;
  txHash: string;
}

export interface WalrusBlobLifetime {
  blobId: string;
  createdAt: string;
  expiresAt: string;
  renewalOptions: {
    period: string;
    costWAL: number;
    costUSD: number;
  }[];
  autoRenewal: boolean;
  renewalHistory: {
    timestamp: string;
    period: string;
    costWAL: number;
    costUSD: number;
    txHash: string;
  }[];
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

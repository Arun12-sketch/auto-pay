export interface AgentService {
  id: string;
  name: string;
  role: string;
  description: string;
  priceMnee: number;
  icon: string;
  systemInstruction: string;
  capabilities: string[];
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  balanceMnee: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum PaymentStatus {
  IDLE = 'IDLE',
  APPROVING = 'APPROVING',
  APPROVED = 'APPROVED',
  PAYING = 'PAYING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface Transaction {
  id: string;
  serviceName: string;
  amount: number;
  timestamp: number;
  status: 'Completed' | 'Failed';
  txHash: string;
  type?: 'crypto' | 'fiat'; // Added to distinguish payment types
}

export interface AuraWalletState {
  isCreated: boolean;
  walletId: string | null;
  balanceUsd: number;
}

export interface FiatTransaction {
  id: string;
  description: string;
  amount: number;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  recipient?: string;
}

export interface MneeConfig {
  approver: string;
  decimals: number;
  feeAddress: string;
  burnAddress: string;
  mintAddress: string;
  fees: {
    fee: number;
    max: number;
    min: number;
  }[];
  tokenId: string;
}

// Add Window interface extension for Ethereum (MetaMask)
declare global {
  interface Window {
    ethereum?: any;
  }
}
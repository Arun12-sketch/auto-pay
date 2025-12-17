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
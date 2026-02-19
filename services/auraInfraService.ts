// AURA Infra API Service for Fiat/USD Payments
// Integrates with https://api.nanilabs.io for traditional finance operations

const AURA_API_BASE_URL = 'https://api.nanilabs.io';

// Mock data for demo purposes since we don't have real API credentials
const MOCK_WALLET_DATA = {
  walletId: 'aura_wallet_' + Math.random().toString(36).substr(2, 9),
  balance: 0,
  currency: 'USD',
  status: 'active',
  createdAt: new Date().toISOString()
};

export interface AuraWallet {
  walletId: string;
  balance: number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface AuraTransaction {
  transactionId: string;
  fromWallet: string;
  toWallet?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  description?: string;
}

export interface AuraStats {
  totalTransactions: number;
  totalVolume: number;
  currency: string;
  activeWallets: number;
  period: string;
}

/**
 * Create a USD wallet for fiat payments
 * POST /wallets
 */
export const createAuraWallet = async (agentId: string): Promise<AuraWallet> => {
  try {
    console.log('💵 Creating AURA USD Wallet for agent:', agentId);
    
    // In production, this would be a real API call:
    // const response = await fetch(`${AURA_API_BASE_URL}/wallets`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${API_KEY}`
    //   },
    //   body: JSON.stringify({ agentId })
    // });
    
    // For demo purposes, simulate API delay and return mock data
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    const wallet: AuraWallet = {
      ...MOCK_WALLET_DATA,
      walletId: `aura_${agentId}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    console.log('✅ AURA Wallet Created:', wallet);
    return wallet;
  } catch (error) {
    console.error('Failed to create AURA wallet:', error);
    throw new Error('Failed to create USD wallet');
  }
};

/**
 * Transfer USD from one wallet to another (e.g., agent paying contractor)
 * POST /transactions
 */
export const createAuraTransaction = async (
  fromWallet: string,
  toWallet: string,
  amount: number,
  description?: string
): Promise<AuraTransaction> => {
  try {
    console.log('💸 Processing AURA USD Transfer:', { fromWallet, toWallet, amount });
    
    // In production:
    // const response = await fetch(`${AURA_API_BASE_URL}/transactions`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${API_KEY}`
    //   },
    //   body: JSON.stringify({ fromWallet, toWallet, amount, description })
    // });
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    // Simulate occasional failure (5% chance)
    if (Math.random() < 0.05) {
      throw new Error('Insufficient USD balance or network error');
    }
    
    const transaction: AuraTransaction = {
      transactionId: 'aura_tx_' + Math.random().toString(36).substr(2, 12),
      fromWallet,
      toWallet,
      amount,
      currency: 'USD',
      status: 'completed',
      timestamp: new Date().toISOString(),
      description
    };
    
    console.log('✅ AURA Transfer Completed:', transaction);
    return transaction;
  } catch (error: any) {
    console.error('AURA transfer failed:', error);
    throw new Error(error.message || 'USD transfer failed');
  }
};

/**
 * Get payment analytics
 * GET /stats
 */
export const getAuraStats = async (walletId?: string): Promise<AuraStats> => {
  try {
    console.log('📊 Fetching AURA Analytics...');
    
    // In production:
    // const url = walletId 
    //   ? `${AURA_API_BASE_URL}/stats?walletId=${walletId}`
    //   : `${AURA_API_BASE_URL}/stats`;
    // const response = await fetch(url, {
    //   headers: {
    //     'Authorization': `Bearer ${API_KEY}`
    //   }
    // });
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const stats: AuraStats = {
      totalTransactions: Math.floor(Math.random() * 100) + 50,
      totalVolume: Math.floor(Math.random() * 10000) + 5000,
      currency: 'USD',
      activeWallets: Math.floor(Math.random() * 50) + 20,
      period: 'last_30_days'
    };
    
    console.log('✅ AURA Stats Retrieved:', stats);
    return stats;
  } catch (error) {
    console.error('Failed to fetch AURA stats:', error);
    throw new Error('Failed to fetch analytics');
  }
};

/**
 * Convert MNEE to USD (for display purposes)
 * Assumes 1 MNEE = 1 USD (stablecoin peg)
 */
export const convertMneeToUsd = (mneeAmount: number): number => {
  return mneeAmount; // 1:1 peg for stablecoin
};

/**
 * Simulate funding a USD wallet from crypto earnings
 * This represents the flow: Agent earns crypto → needs USD for contractor
 */
export const fundWalletFromCrypto = async (
  walletId: string,
  mneeAmount: number
): Promise<boolean> => {
  try {
    console.log(`🔄 Converting ${mneeAmount} MNEE to USD for wallet ${walletId}...`);
    
    // Simulate conversion process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const usdAmount = convertMneeToUsd(mneeAmount);
    console.log(`✅ Funded wallet with $${usdAmount.toFixed(2)} USD`);
    
    return true;
  } catch (error) {
    console.error('Failed to fund wallet from crypto:', error);
    return false;
  }
};

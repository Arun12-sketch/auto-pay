import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { AuraWalletState, FiatTransaction } from '../types';
import { 
  createAuraWallet, 
  createAuraTransaction, 
  getAuraStats,
  fundWalletFromCrypto,
  AuraStats
} from '../services/auraInfraService';

interface AuraWalletPanelProps {
  isConnected: boolean;
  walletAddress: string | null;
}

const AuraWalletPanel: React.FC<AuraWalletPanelProps> = ({ isConnected, walletAddress }) => {
  const [auraWallet, setAuraWallet] = useState<AuraWalletState>({
    isCreated: false,
    walletId: null,
    balanceUsd: 0
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientWallet, setRecipientWallet] = useState('');
  const [transferDescription, setTransferDescription] = useState('');
  const [stats, setStats] = useState<AuraStats | null>(null);
  const [fiatTransactions, setFiatTransactions] = useState<FiatTransaction[]>([]);
  const [isFunding, setIsFunding] = useState(false);

  // Load wallet state from localStorage
  useEffect(() => {
    if (isConnected && walletAddress) {
      const savedWallet = localStorage.getItem(`aura_wallet_${walletAddress}`);
      if (savedWallet) {
        try {
          setAuraWallet(JSON.parse(savedWallet));
        } catch (e) {
          console.error('Failed to parse saved AURA wallet', e);
        }
      }
      
      const savedTransactions = localStorage.getItem(`aura_transactions_${walletAddress}`);
      if (savedTransactions) {
        try {
          setFiatTransactions(JSON.parse(savedTransactions));
        } catch (e) {
          console.error('Failed to parse saved AURA transactions', e);
        }
      }
    }
  }, [isConnected, walletAddress]);

  // Fetch stats when wallet is created
  useEffect(() => {
    if (auraWallet.isCreated && auraWallet.walletId) {
      fetchStats();
    }
  }, [auraWallet.isCreated, auraWallet.walletId]);

  const fetchStats = async () => {
    try {
      const data = await getAuraStats(auraWallet.walletId || undefined);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleCreateWallet = async () => {
    if (!isConnected || !walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    setIsCreating(true);
    try {
      const wallet = await createAuraWallet(walletAddress);
      const newWalletState: AuraWalletState = {
        isCreated: true,
        walletId: wallet.walletId,
        balanceUsd: wallet.balance
      };
      
      setAuraWallet(newWalletState);
      localStorage.setItem(`aura_wallet_${walletAddress}`, JSON.stringify(newWalletState));
      
      alert('✅ USD Wallet created successfully!');
    } catch (error: any) {
      alert('Failed to create wallet: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleFundWallet = async (amount: number) => {
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsFunding(true);
    try {
      const success = await fundWalletFromCrypto(auraWallet.walletId!, amount);
      if (success) {
        const newBalance = auraWallet.balanceUsd + amount;
        const updatedWallet = { ...auraWallet, balanceUsd: newBalance };
        setAuraWallet(updatedWallet);
        localStorage.setItem(`aura_wallet_${walletAddress}`, JSON.stringify(updatedWallet));
        alert(`✅ Wallet funded with $${amount.toFixed(2)} USD`);
      }
    } catch (error: any) {
      alert('Failed to fund wallet: ' + error.message);
    } finally {
      setIsFunding(false);
    }
  };

  const handleTransfer = async () => {
    if (!transferAmount || parseFloat(transferAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (!recipientWallet) {
      alert('Please enter recipient wallet ID');
      return;
    }

    const amount = parseFloat(transferAmount);
    if (amount > auraWallet.balanceUsd) {
      alert('Insufficient USD balance');
      return;
    }

    setIsTransferring(true);
    try {
      const transaction = await createAuraTransaction(
        auraWallet.walletId!,
        recipientWallet,
        amount,
        transferDescription || 'Payment to contractor'
      );

      // Update balance
      const newBalance = auraWallet.balanceUsd - amount;
      const updatedWallet = { ...auraWallet, balanceUsd: newBalance };
      setAuraWallet(updatedWallet);
      localStorage.setItem(`aura_wallet_${walletAddress}`, JSON.stringify(updatedWallet));

      // Add to transaction history
      const newTransaction: FiatTransaction = {
        id: transaction.transactionId,
        description: transferDescription || 'Payment to contractor',
        amount: amount,
        timestamp: new Date(transaction.timestamp).getTime(),
        status: transaction.status,
        transactionId: transaction.transactionId,
        recipient: recipientWallet
      };
      
      const updatedTransactions = [newTransaction, ...fiatTransactions];
      setFiatTransactions(updatedTransactions);
      localStorage.setItem(`aura_transactions_${walletAddress}`, JSON.stringify(updatedTransactions));

      // Reset form
      setTransferAmount('');
      setRecipientWallet('');
      setTransferDescription('');
      setShowTransferModal(false);
      
      alert('✅ USD transfer completed successfully!');
    } catch (error: any) {
      alert('Transfer failed: ' + error.message);
    } finally {
      setIsTransferring(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isConnected) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center">
        <div className="inline-flex p-4 rounded-full bg-slate-800/50 text-slate-500 mb-4">
          <Icons.DollarSign size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
        <p className="text-slate-400">
          Connect your crypto wallet to access AURA Infra USD payment features
        </p>
      </div>
    );
  }

  if (!auraWallet.isCreated) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
            <Icons.DollarSign size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">AURA USD Wallet</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Create a USD wallet to enable fiat payments for human contractors. 
              Convert your crypto earnings to traditional currency instantly.
            </p>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <Icons.Check size={16} className="text-emerald-400" />
                <span>Instant USD transfers</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Icons.Check size={16} className="text-emerald-400" />
                <span>Pay contractors directly</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Icons.Check size={16} className="text-emerald-400" />
                <span>Real-time analytics</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCreateWallet}
          disabled={isCreating}
          className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {isCreating ? (
            <>
              <Icons.Loader className="animate-spin" size={18} />
              Creating Wallet...
            </>
          ) : (
            <>
              <Icons.Wallet size={18} />
              Create USD Wallet
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Info Card */}
      <div className="bg-gradient-to-br from-blue-900/30 to-slate-900/50 border border-blue-800/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Icons.Wallet className="text-blue-400" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-slate-400">AURA USD Balance</h3>
              <p className="text-2xl font-bold text-white">
                ${auraWallet.balanceUsd.toFixed(2)}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Active
          </span>
        </div>
        
        <p className="text-xs text-slate-500 font-mono mb-4">
          Wallet ID: {auraWallet.walletId?.substring(0, 20)}...
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowTransferModal(true)}
            className="py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Icons.Send size={16} />
            Transfer USD
          </button>
          <button
            onClick={() => {
              const amount = prompt('Enter MNEE amount to convert to USD:');
              if (amount && !isNaN(parseFloat(amount))) {
                handleFundWallet(parseFloat(amount));
              }
            }}
            className="py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Icons.ArrowDownUp size={16} />
            Fund from Crypto
          </button>
        </div>
      </div>

      {/* Stats Card */}
      {stats && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icons.BarChart className="text-slate-400" size={20} />
            <h3 className="text-lg font-bold text-white">Analytics</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Total Volume</p>
              <p className="text-lg font-bold text-white">${stats.totalVolume.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Transactions</p>
              <p className="text-lg font-bold text-white">{stats.totalTransactions}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Active Wallets</p>
              <p className="text-lg font-bold text-white">{stats.activeWallets}</p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History */}
      {fiatTransactions.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icons.History className="text-slate-400" size={20} />
            <h3 className="text-lg font-bold text-white">USD Transaction History</h3>
          </div>
          <div className="space-y-3">
            {fiatTransactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{tx.description}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(tx.timestamp)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-400">-${tx.amount.toFixed(2)}</p>
                  <span className={`text-xs ${
                    tx.status === 'completed' ? 'text-emerald-400' : 
                    tx.status === 'failed' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Transfer USD</h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <Icons.X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Amount (USD)
                </label>
                <input
                  type="number"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Available: ${auraWallet.balanceUsd.toFixed(2)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Recipient Wallet ID
                </label>
                <input
                  type="text"
                  value={recipientWallet}
                  onChange={(e) => setRecipientWallet(e.target.value)}
                  placeholder="aura_contractor_xxxxx"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={transferDescription}
                  onChange={(e) => setTransferDescription(e.target.value)}
                  placeholder="e.g., Payment for design work"
                  className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            <button
              onClick={handleTransfer}
              disabled={isTransferring}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isTransferring ? (
                <>
                  <Icons.Loader className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                <>
                  <Icons.Send size={18} />
                  Send USD
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuraWalletPanel;

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import PaymentModal from './components/PaymentModal';
import ChatInterface from './components/ChatInterface';
import AuraWalletPanel from './components/AuraWalletPanel';
import { Icons } from './components/Icons';
import { AgentService, WalletState, Transaction, MneeConfig } from './types';
import { AGENT_SERVICES } from './constants';
import { mockConnectWallet } from './services/mockWeb3Service';
import { fetchMneeConfig } from './services/mneeApiService';

function App() {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    balanceMnee: 0
  });

  const [mneeConfig, setMneeConfig] = useState<MneeConfig | null>(null);
  const [selectedService, setSelectedService] = useState<AgentService | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Initialize transactions from localStorage
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agentpay_transactions');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse transaction history", e);
        }
      }
    }
    return [];
  });

  useEffect(() => {
    // Fetch MNEE Network Config on load
    const loadConfig = async () => {
      const config = await fetchMneeConfig();
      setMneeConfig(config);
    };
    loadConfig();
  }, []);

  const handleConnect = async () => {
    try {
      const newWalletState = await mockConnectWallet();
      setWallet(newWalletState);
    } catch (e: any) {
      console.error("Connection failed", e);
      // Show alert to user if connection fails (e.g. they closed the popup)
      if (e.message) {
         alert(`Cüzdan bağlantısı başarısız: ${e.message}`);
      }
    }
  };

  const handleDisconnect = () => {
    setWallet({
      isConnected: false,
      address: null,
      balanceMnee: 0
    });
    // Optional: Reset active session if wallet disconnects
    setIsPaid(false);
    setSelectedService(null);
  };

  const handleSelectService = (service: AgentService) => {
    if (!wallet.isConnected) {
      alert("Lütfen önce sağ üstteki 'Connect Wallet' butonu ile cüzdanınızı bağlayın.");
      return;
    }
    setSelectedService(service);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = () => {
    if (selectedService) {
      // 1. Deduct simulated balance
      setWallet(prev => ({
        ...prev,
        balanceMnee: prev.balanceMnee - selectedService.priceMnee
      }));

      // 2. Create new transaction record
      const newTx: Transaction = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        serviceName: selectedService.name,
        amount: selectedService.priceMnee,
        timestamp: Date.now(),
        status: 'Completed',
        txHash: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        type: 'crypto'
      };

      // 3. Update state and localStorage
      const updatedTransactions = [newTx, ...transactions];
      setTransactions(updatedTransactions);
      localStorage.setItem('agentpay_transactions', JSON.stringify(updatedTransactions));
    }
    
    setIsPaid(true);
    setShowPaymentModal(false);
  };

  const handleExitChat = () => {
    setIsPaid(false);
    setSelectedService(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter Logic
  const categories = ['All', 'Finance', 'Development', 'Creative', 'Productivity'];

  const filteredServices = AGENT_SERVICES.filter(service => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      service.name.toLowerCase().includes(query) ||
      service.role.toLowerCase().includes(query) ||
      service.description.toLowerCase().includes(query);

    if (activeCategory === 'All') return matchesSearch;

    const role = service.role.toLowerCase();
    
    // Updated filtering logic to properly categorize DeFi and specialized agents
    const matchesCategory =
      (activeCategory === 'Finance' && (role.includes('financial') || role.includes('defi') || role.includes('yield'))) ||
      (activeCategory === 'Development' && (role.includes('contract') || role.includes('auditor') || role.includes('code'))) ||
      (activeCategory === 'Creative' && (role.includes('creative') || role.includes('copywriter') || role.includes('art'))) ||
      (activeCategory === 'Productivity' && (role.includes('assistant') || role.includes('general') || role.includes('planner')));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 text-slate-100 pb-10 flex flex-col">
      <Navbar 
        wallet={wallet} 
        onConnect={handleConnect} 
        onDisconnect={handleDisconnect} 
        mneeConfig={mneeConfig} 
      />

      {/* Main Content Area */}
      <main className="container mx-auto px-4 pt-8 flex-grow">
        
        {/* Scenario 1: Active Chat (Post-Payment) */}
        {isPaid && selectedService ? (
          <ChatInterface service={selectedService} onExit={handleExitChat} />
        ) : (
          /* Scenario 2: Marketplace */
          <div className="max-w-6xl mx-auto space-y-12">
            
            <header className="text-center space-y-4 py-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-800 text-emerald-400 text-sm font-medium mb-4">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                MNEE Hackathon: Live Demo
              </div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                Programmable <span className="text-emerald-500">Intelligence</span>
              </h1>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Hire autonomous AI agents instantly using MNEE stablecoin. 
                Secure, transparent, and settled on-chain.
              </p>
            </header>

            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between sticky top-20 z-40 bg-slate-950/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800/50 shadow-xl">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Search className="text-slate-500" size={18} />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                  placeholder="Search agents by name, role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
                  >
                    <Icons.X size={16} />
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto scrollbar-hide">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200 border border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredServices.map((service) => {
                  const IconComponent = Icons[service.icon as keyof typeof Icons] || Icons.Bot;
                  return (
                    <div 
                      key={service.id}
                      className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-900/20 flex flex-col"
                    >
                      <div className="mb-4 w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                        <IconComponent className="text-emerald-400" size={24} />
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-1">{service.name}</h3>
                      <p className="text-sm font-medium text-emerald-400 mb-3">{service.role}</p>
                      <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                        {service.description}
                      </p>

                      <div className="mt-auto pt-6 border-t border-slate-800">
                        <div className="flex items-end justify-between mb-4">
                          <span className="text-slate-500 text-sm">Price</span>
                          <div className="text-right">
                            <span className="text-lg font-bold text-white">{service.priceMnee.toFixed(2)}</span>
                            <span className="text-xs font-bold text-emerald-500 ml-1">MNEE</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleSelectService(service)}
                          className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-white text-slate-900 font-semibold transition-colors flex items-center justify-center gap-2"
                        >
                           <span>Hire Agent</span>
                           <Icons.Lock size={14} className="text-slate-500" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed animate-in fade-in zoom-in-95">
                 <div className="inline-flex p-4 rounded-full bg-slate-800/50 text-slate-600 mb-4">
                   <Icons.Search size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">No agents found</h3>
                 <p className="text-slate-400 max-w-sm mx-auto">
                   We couldn't find any agents matching "{searchQuery}" in the {activeCategory !== 'All' ? activeCategory : ''} category.
                 </p>
                 <button 
                  onClick={() => {setSearchQuery(''); setActiveCategory('All');}} 
                  className="mt-6 text-emerald-400 hover:text-emerald-300 font-medium hover:underline underline-offset-4"
                 >
                   Clear all filters
                 </button>
              </div>
            )}

            {/* AURA Infra USD Wallet Section */}
            <div className="pt-12 border-t border-slate-800/50">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/30 border border-blue-800 text-blue-400 text-sm font-medium mb-3">
                  <Icons.DollarSign size={14} />
                  Powered by AURA Infra
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Fiat Payment Bridge</h2>
                <p className="text-slate-400 max-w-3xl">
                  Convert your crypto earnings to USD and pay human contractors seamlessly. 
                  AURA Infra connects Web3 agents with traditional finance.
                </p>
              </div>
              <AuraWalletPanel 
                isConnected={wallet.isConnected}
                walletAddress={wallet.address}
              />
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-800/50">
               <div className="flex gap-4">
                 <div className="mt-1 bg-slate-800 p-2 rounded-lg h-fit text-emerald-400"><Icons.Wallet size={20}/></div>
                 <div>
                   <h4 className="font-semibold text-white mb-1">MNEE Native</h4>
                   <p className="text-sm text-slate-400">Services are denominated and settled exclusively in MNEE stablecoin.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="mt-1 bg-slate-800 p-2 rounded-lg h-fit text-purple-400"><Icons.Cpu size={20}/></div>
                 <div>
                   <h4 className="font-semibold text-white mb-1">Gemini Powered</h4>
                   <p className="text-sm text-slate-400">Agents utilize Gemini 2.5 Flash for high-speed, reasoning-heavy tasks.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="mt-1 bg-slate-800 p-2 rounded-lg h-fit text-blue-400"><Icons.ShieldCheck size={20}/></div>
                 <div>
                   <h4 className="font-semibold text-white mb-1">Smart Settlement</h4>
                   <p className="text-sm text-slate-400">On-chain approval and transfer flow simulation for hackathon demo.</p>
                 </div>
               </div>
            </div>

            {/* Transaction History Section */}
            {transactions.length > 0 && (
              <div className="mt-16 pt-12 border-t border-slate-800">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-800 rounded-lg text-slate-400">
                    <Icons.History size={20} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-slate-900 text-slate-200 uppercase font-medium">
                      <tr>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Transaction Hash</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">{tx.serviceName}</td>
                          <td className="px-6 py-4">{formatDate(tx.timestamp)}</td>
                          <td className="px-6 py-4 text-emerald-400 font-medium">
                            {tx.amount.toFixed(2)} MNEE
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                              tx.type === 'fiat' 
                                ? 'bg-blue-900/30 text-blue-400 border border-blue-900/50' 
                                : 'bg-purple-900/30 text-purple-400 border border-purple-900/50'
                            }`}>
                              {tx.type === 'fiat' ? '💵 USD' : '⚡ Crypto'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-900/50">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">
                            {tx.txHash.substring(0, 10)}...{tx.txHash.substring(tx.txHash.length - 8)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-slate-900/50 bg-slate-950/50 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
           <p className="text-slate-500 text-sm mb-2">
             <span className="font-semibold text-slate-400">AgentPay</span> • Built for the MNEE Hackathon
           </p>
           <p className="text-slate-600 text-xs">
             Demonstrating Programmable Money with Autonomous Agents on MNEE Stablecoin.
           </p>
        </div>
      </footer>

      {/* Modals */}
      {showPaymentModal && selectedService && (
        <PaymentModal 
          service={selectedService} 
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          mneeConfig={mneeConfig}
        />
      )}
    </div>
  );
}

export default App;
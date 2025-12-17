import React from 'react';
import { WalletState, MneeConfig } from '../types';
import { Icons } from './Icons';

interface NavbarProps {
  wallet: WalletState;
  onConnect: () => void;
  onDisconnect: () => void;
  mneeConfig: MneeConfig | null;
}

const Navbar: React.FC<NavbarProps> = ({ wallet, onConnect, onDisconnect, mneeConfig }) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-2 text-emerald-400 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => window.location.reload()}
          role="button"
          aria-label="Navigate to home"
        >
          <Icons.Cpu size={24} />
          <span className="text-xl font-bold tracking-tight text-white">
            Agent<span className="text-emerald-400">Pay</span>
          </span>
          {mneeConfig && (
            <div className="hidden lg:flex items-center gap-1 ml-4 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-medium text-slate-400">MNEE Sandbox</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {wallet.isConnected ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3 bg-slate-800/80 rounded-full pl-4 pr-1 py-1 border border-slate-700/50 backdrop-blur-sm">
                <div className="flex flex-col items-end leading-none mr-1 py-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Balance</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">
                    {wallet.balanceMnee.toFixed(2)} MNEE
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900 rounded-full px-3 py-1.5 border border-slate-800">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-xs text-slate-300 font-mono font-medium">{wallet.address}</span>
                </div>
              </div>

              {/* Mobile simplified view */}
              <div className="md:hidden flex items-center bg-slate-800 rounded-full px-3 py-1.5 border border-slate-700">
                <span className="text-xs font-bold text-emerald-400 mr-2">{wallet.balanceMnee.toFixed(0)} MNEE</span>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>

              <button
                onClick={onDisconnect}
                className="group p-2 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all"
                title="Disconnect Wallet"
              >
                <Icons.LogOut size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={onConnect}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-lg shadow-emerald-900/20"
            >
              <Icons.Wallet size={18} />
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React, { useState } from 'react';
import { AgentService, PaymentStatus, MneeConfig } from '../types';
import { Icons } from './Icons';
import { mockApproveMnee, mockTransferMnee } from '../services/mockWeb3Service';
import { MNEE_CONTRACT_ADDRESS, PLATFORM_OWNER_WALLET } from '../constants';

interface PaymentModalProps {
  service: AgentService;
  onClose: () => void;
  onSuccess: () => void;
  mneeConfig: MneeConfig | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ service, onClose, onSuccess, mneeConfig }) => {
  const [status, setStatus] = useState<PaymentStatus>(PaymentStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [failedStep, setFailedStep] = useState<'approve' | 'pay' | null>(null);

  // Business Logic: 5% Platform Fee for the Project Creator
  const PLATFORM_FEE_PERCENT = 0.05;
  const servicePrice = service.priceMnee;
  const platformFee = servicePrice * PLATFORM_FEE_PERCENT;
  const totalPrice = servicePrice + platformFee;

  const handlePayment = async () => {
    setError(null);
    setFailedStep(null);

    try {
      // Step 1: Approve Total Amount (Price + Fee)
      setStatus(PaymentStatus.APPROVING);
      try {
        await mockApproveMnee(totalPrice);
      } catch (e: any) {
        setFailedStep('approve');
        throw new Error(e.message || "Approval denied. You must approve MNEE usage to proceed.");
      }
      setStatus(PaymentStatus.APPROVED);

      // Step 2: Transfer Total Amount
      setStatus(PaymentStatus.PAYING);
      try {
        await mockTransferMnee(totalPrice);
      } catch (e: any) {
        setFailedStep('pay');
        throw new Error(e.message || "Payment failed. Insufficient funds or network error.");
      }
      setStatus(PaymentStatus.COMPLETED);

      // Brief delay to show success state before closing
      setTimeout(() => {
        onSuccess();
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setStatus(PaymentStatus.FAILED);
      setError(err.message);
    }
  };

  const isProcessing = status === PaymentStatus.APPROVING || status === PaymentStatus.PAYING;
  const isDone = status === PaymentStatus.COMPLETED;

  const getStepIcon = (step: 'approve' | 'pay') => {
    if (failedStep === step) return <Icons.XCircle className="text-red-500" size={20} />;
    
    if (step === 'approve') {
        if (status === PaymentStatus.APPROVING) return <Icons.Loader2 className="animate-spin text-blue-400" size={20} />;
        if (status === PaymentStatus.APPROVED || status === PaymentStatus.PAYING || status === PaymentStatus.COMPLETED) return <Icons.CheckCircle2 className="text-emerald-400" size={20} />;
    }
    
    if (step === 'pay') {
        if (status === PaymentStatus.PAYING) return <Icons.Loader2 className="animate-spin text-blue-400" size={20} />;
        if (status === PaymentStatus.COMPLETED) return <Icons.CheckCircle2 className="text-emerald-400" size={20} />;
    }
    
    return <div className="w-5 h-5 rounded-full border-2 border-slate-600" />;
  };

  const getStepClasses = (step: 'approve' | 'pay') => {
      if (failedStep === step) return 'bg-red-900/20 border-red-800 text-red-400';
      
      if (step === 'approve') {
          if (status === PaymentStatus.APPROVED || status === PaymentStatus.PAYING || status === PaymentStatus.COMPLETED) return 'bg-emerald-900/20 border-emerald-800 text-emerald-400';
          if (status === PaymentStatus.APPROVING) return 'bg-blue-900/20 border-blue-800 text-blue-400';
      }
      
      if (step === 'pay') {
          if (status === PaymentStatus.COMPLETED) return 'bg-emerald-900/20 border-emerald-800 text-emerald-400';
          if (status === PaymentStatus.PAYING) return 'bg-blue-900/20 border-blue-800 text-blue-400';
      }
      
      return 'bg-slate-800 border-slate-700 text-slate-400';
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <h3 className="text-lg font-semibold text-white">Purchase Agent Access</h3>
          {!isProcessing && !isDone && (
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <Icons.XCircle size={24} className="hover:text-red-400" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-emerald-900/30 rounded-lg text-emerald-400">
               <Icons.Bot size={32} />
            </div>
            <div>
              <h4 className="text-white font-medium">{service.name}</h4>
              <p className="text-sm text-slate-400">{service.role}</p>
            </div>
          </div>

          {/* Invoice Breakdown - Shows Profit Model */}
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex justify-between text-sm text-slate-400">
              <span>Service Price</span>
              <span>{servicePrice.toFixed(2)} MNEE</span>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span className="flex items-center gap-1">
                Platform Fee <span className="text-[10px] bg-slate-800 px-1 rounded text-slate-500">5%</span>
              </span>
              <span>{platformFee.toFixed(2)} MNEE</span>
            </div>
            <div className="h-px bg-slate-800 my-2" />
            <div className="flex justify-between items-end">
              <span className="font-medium text-white">Total</span>
              <div className="text-right">
                <span className="block text-xl font-bold text-white">{totalPrice.toFixed(2)}</span>
                <span className="text-xs font-bold text-emerald-500">MNEE</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-950/30 border border-red-900/50 rounded-lg p-3 flex gap-3 animate-in slide-in-from-top-2">
              <Icons.AlertCircle className="text-red-500 shrink-0" size={20} />
              <div>
                <h5 className="text-sm font-semibold text-red-400">Transaction Failed</h5>
                <p className="text-xs text-red-300/80 mt-1">{error}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {/* Step 1: Approval */}
            <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${getStepClasses('approve')}`}>
              {getStepIcon('approve')}
              <div className="flex-1">
                <p className="text-sm font-medium">Approve MNEE</p>
                <p className={`text-xs ${failedStep === 'approve' ? 'text-red-400/70' : 'opacity-70'}`}>
                  {failedStep === 'approve' ? 'Approval denied' : `Allow access to ${totalPrice.toFixed(2)} MNEE`}
                </p>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${getStepClasses('pay')}`}>
               {getStepIcon('pay')}
              <div className="flex-1">
                <p className="text-sm font-medium">Confirm Payment</p>
                <p className={`text-xs ${failedStep === 'pay' ? 'text-red-400/70' : 'opacity-70'}`}>
                  {failedStep === 'pay' ? 'Transfer failed' : 'Execute smart contract transfer'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-950 p-3 rounded text-xs text-slate-500 font-mono break-all border border-slate-800 flex flex-col gap-2">
             <div className="flex items-center justify-between">
               <span className="truncate mr-2 text-slate-400">Network ID: {mneeConfig ? mneeConfig.tokenId.substring(0, 16) + '...' : 'Loading...'}</span>
               <Icons.Cpu size={12} className="text-slate-600" />
             </div>
             <div className="flex items-center justify-between pt-2 border-t border-slate-800">
               <span className="truncate mr-2">Token Contract: {MNEE_CONTRACT_ADDRESS.substring(0, 16)}...</span>
               <Icons.Lock size={12} />
             </div>
             <div className="flex items-center justify-between pt-2 border-t border-slate-800">
               <span className="truncate mr-2">Fee Recipient: {PLATFORM_OWNER_WALLET.substring(0, 16)}...</span>
               <Icons.Wallet size={12} className="text-emerald-500" />
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          {status === PaymentStatus.FAILED ? (
             <button 
             onClick={handlePayment}
             className="w-full py-3 rounded-lg font-medium bg-red-600 hover:bg-red-500 text-white transition-colors flex items-center justify-center gap-2"
           >
             <Icons.ArrowLeft size={18} className="rotate-180" /> 
             Retry Transaction
           </button>
          ) : (
            <button
              onClick={handlePayment}
              disabled={status !== PaymentStatus.IDLE}
              className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                status === PaymentStatus.IDLE 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40' 
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {status === PaymentStatus.IDLE && `Pay ${totalPrice.toFixed(2)} MNEE`}
              {status === PaymentStatus.APPROVING && 'Approving...'}
              {status === PaymentStatus.APPROVED && 'Approved'}
              {status === PaymentStatus.PAYING && 'Processing Payment...'}
              {status === PaymentStatus.COMPLETED && 'Success!'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
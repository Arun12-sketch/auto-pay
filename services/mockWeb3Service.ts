// This service simulates the blockchain interactions.
// Updated to support REAL MetaMask connection if available.

import { WalletState } from "../types";
import { PLATFORM_OWNER_WALLET } from "../constants";

const DELAY_MS = 1500;

export const mockConnectWallet = async (): Promise<WalletState> => {
  // Use (window as any) to bypass strict TypeScript checks for ethereum injection
  const { ethereum } = window as any;

  // 1. Check if MetaMask (or other Web3 provider) is installed
  if (ethereum) {
    try {
      console.log("🦊 MetaMask found! Requesting connection...");
      
      // Request account access from the real wallet
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from MetaMask.");
      }

      const account = accounts[0]; // The connected address

      console.log("✅ Connected to real wallet:", account);

      return {
        isConnected: true,
        address: account,
        // Since we don't have the MNEE Token ABI/Contract loaded in this frontend-only demo, 
        // we simulate a balance so you can still test the UI flow.
        // In a real production app, you would fetch the real 'balanceOf' here.
        balanceMnee: 1540.00 
      };
    } catch (error: any) {
      console.error("User rejected connection or error:", error);
      throw error; // Rethrow to be caught by App.tsx
    }
  } else {
    // Fallback for users without MetaMask (Demo Mode)
    console.warn("⚠️ MetaMask not detected. Using mock data.");
    alert("MetaMask eklentisi bulunamadı. Demo modunda devam ediliyor.");
    
    await new Promise(resolve => setTimeout(resolve, 800));
    return {
      isConnected: true,
      address: "0x71C...9A23", // Mock address
      balanceMnee: 1540.00
    };
  }
};

export const mockApproveMnee = async (amount: number): Promise<boolean> => {
  console.log(`📝 Sending 'Approve' transaction for ${amount.toFixed(2)} MNEE...`);
  
  // To make this REAL, you would use:
  // const provider = new ethers.BrowserProvider((window as any).ethereum);
  // const signer = await provider.getSigner();
  // const tokenContract = new ethers.Contract(MNEE_ADDRESS, ABI, signer);
  // await tokenContract.approve(SPENDER_ADDRESS, amount);

  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  
  // Simulate random rejection
  if (Math.random() < 0.15) {
      throw new Error("User denied transaction signature.");
  }
  console.log("✅ Approval confirmed on-chain.");
  return true;
};

export const mockTransferMnee = async (totalAmount: number): Promise<boolean> => {
  console.log(`🔄 Initiating Smart Contract Payment Distribution for ${totalAmount.toFixed(2)} MNEE...`);
  await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  
  // Calculate the split based on the 5% markup model logic used in PaymentModal
  const baseAmount = totalAmount / 1.05;
  const platformFee = totalAmount - baseAmount;

  console.log(`💸 Smart Contract Split Execution:`);
  console.log(`   ➡ ${baseAmount.toFixed(2)} MNEE transferred to Agent Service Provider`);
  console.log(`   ➡ ${platformFee.toFixed(2)} MNEE transferred to Platform Owner (${PLATFORM_OWNER_WALLET})`);
  console.log(`   ✅ Transaction Finalized`);

  // Simulate random failure
  if (Math.random() < 0.10) {
      throw new Error("Insufficient MNEE balance or gas.");
  }
  return true;
};
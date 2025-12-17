import { AgentService } from './types';

// The Official MNEE Contract Address on Ethereum (from prompt)
export const MNEE_CONTRACT_ADDRESS = "0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF";
export const SPENDER_CONTRACT_ADDRESS = "0x123...Marketplace...789"; // Mock contract for the marketplace

// ---------------------------------------------------------
// 👇 SİZİN CÜZDAN ADRESİNİZ (GÜNCELLENDİ)
// Platform komisyonları bu adrese simüle edilecektir.
// ---------------------------------------------------------
export const PLATFORM_OWNER_WALLET = "0x947b46b49a5ad331dbdb5221050020566e28fbac"; 

export const AGENT_SERVICES: AgentService[] = [
  {
    id: 'agent-defi-1',
    name: 'YieldBot',
    role: 'DeFi Yield Optimizer',
    description: 'Automates yield farming strategies across MNEE pools to maximize returns while actively managing risk.',
    priceMnee: 8.50,
    icon: 'LineChart',
    systemInstruction: 'You are YieldBot, an automated DeFi portfolio manager. You specialize in stablecoin yield strategies, specifically for MNEE. You analyze APYs, TVL, and impermanent loss risks to optimize returns.',
    capabilities: ['Yield Farming', 'Liquidity Provision', 'Risk Management']
  },
  {
    id: 'agent-fin-1',
    name: 'Ledger',
    role: 'Financial Analyst',
    description: 'Expert in analyzing market trends, tokenomics, and providing investment summaries based on data.',
    priceMnee: 5.00,
    icon: 'LineChart',
    systemInstruction: 'You are Ledger, a senior financial analyst. You provide concise, data-driven insights about markets and economics. You are professional, slightly cautious, and use financial terminology correctly.',
    capabilities: ['Market Analysis', 'Risk Assessment', 'Portfolio Review']
  },
  {
    id: 'agent-dev-1',
    name: 'Syntax',
    role: 'Smart Contract Auditor',
    description: 'Specializes in reviewing Solidity code for vulnerabilities, gas optimization, and logic errors.',
    priceMnee: 12.50,
    icon: 'ShieldCheck',
    systemInstruction: 'You are Syntax, an expert smart contract security auditor. You analyze code snippets for re-entrancy attacks, overflow issues, and gas optimizations. You speak in a technical, precise manner.',
    capabilities: ['Security Audit', 'Gas Optimization', 'Solidity Help']
  },
  {
    id: 'agent-create-1',
    name: 'Muse',
    role: 'Creative Copywriter',
    description: 'Generates compelling marketing copy, tweet threads, and blog posts tailored for Web3 audiences.',
    priceMnee: 2.00,
    icon: 'Feather',
    systemInstruction: 'You are Muse, a creative copywriter for Web3 brands. Your tone is engaging, modern, and viral-ready. You use emojis effectively and understand crypto-twitter culture.',
    capabilities: ['Tweet Threads', 'Blog Posts', 'Ad Copy']
  },
  {
    id: 'agent-qa-1',
    name: 'Oracle',
    role: 'General Assistant',
    description: 'Your go-to assistant for general knowledge, scheduling planning, and summarization.',
    priceMnee: 1.00,
    icon: 'Bot',
    systemInstruction: 'You are Oracle, a helpful and polite general purpose AI assistant. You answer questions clearly and efficiently.',
    capabilities: ['Research', 'Summarization', 'Planning']
  }
];
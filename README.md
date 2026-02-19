# AgentPay: Programmable Money for AI Agents 🤖💸

**MNEE Hackathon Submission - Track: Best Use of MNEE**

> **MNEE Contract**: `0x8ccedbAe4916b79da7f3F612fB2E8B93A2bFD6cF` (ERC-20 on Ethereum)

AgentPay is a decentralized marketplace where autonomous AI agents provide specialized services (DeFi optimization, smart contract auditing, creative writing) in exchange for **MNEE Stablecoin** payments.

This project demonstrates **Programmable Money** by combining Gemini 2.5 Flash AI with simulated MNEE blockchain settlements.

## 📸 Screenshots

![AgentPay Homepage](./screenshots/homepage.png)
*Browse and hire specialized AI agents with MNEE stablecoin*

---

## 🌟 Features

- **🤖 AI Agent Marketplace** - Browse specialized AI agents (Financial Analysts, Smart Contract Auditors, Creative Copywriters, etc.)
- **⚡ Gemini 2.5 Flash Integration** - Real-time intelligent conversations with hired agents
- **💰 MNEE Stablecoin Payments** - Simulated wallet connection, approval, and on-chain transfers
- **🔒 Smart Settlement** - Programmable payment splits (95% to Agent, 5% to Platform)
- **💵 AURA Infra Fiat Bridge** - Convert crypto earnings to USD and pay human contractors seamlessly
- **🏦 USD Wallet Management** - Create USD wallets, fund from crypto, and transfer to contractors
- **📊 Transaction History** - Immutable record of all hired services (crypto and fiat)
- **📈 Payment Analytics** - Real-time stats on transaction volume and wallet activity
- **🎨 Modern UI/UX** - Beautiful, responsive interface with dark mode

---

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Vanilla CSS with custom design system
- **AI:** Google Gemini API (`gemini-2.5-flash`)
- **Icons:** Lucide React
- **Blockchain:** MNEE Stablecoin (Simulated)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/agentpay.git
   cd agentpay
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Then add your Gemini API key to `.env`:
   ```env
   VITE_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. Open your browser at `http://localhost:5173`

---

## 💡 How It Works

### Crypto Payment Flow
1. **Connect Wallet** - Simulate MetaMask wallet connection
2. **Browse Agents** - Search and filter AI agents by category
3. **Hire Agent** - Pay with MNEE stablecoin (simulated on-chain transaction)
4. **Chat** - Interact with your hired AI agent powered by Gemini 2.5 Flash
5. **Transaction History** - View all past agent hires and payments

### Fiat Payment Flow (AURA Infra Integration)
1. **Create USD Wallet** - Set up a USD wallet for traditional payments
2. **Fund from Crypto** - Convert MNEE earnings to USD (1:1 peg)
3. **Transfer to Contractors** - Send USD directly to human contractors' wallets
4. **Track Analytics** - Monitor transaction volume and payment history

---

## 💳 MNEE Integration

The project simulates MNEE payment flow:

- **Config Fetch:** Attempts to fetch live MNEE network config from sandbox API
- **Approval:** Simulates ERC-20 `approve()` function  
- **Settlement:** Simulates `transferFrom()` with programmable split
- **Transaction Records:** All payments logged with mock transaction hashes

Implementation files:
- `services/mockWeb3Service.ts` - Wallet and transaction simulation
- `components/PaymentModal.tsx` - Payment UI and flow

---

## 💵 AURA Infra Integration

AgentPay now integrates with **AURA Infra** (https://nanilabs.io) to bridge crypto and fiat payments:

### Use Case
1. Agent completes task and receives MNEE payment
2. Agent converts MNEE to USD (stablecoin 1:1 peg)
3. Agent transfers USD to human contractor via AURA wallet

### API Integration
- **POST /wallets** - Create USD wallet for agents
- **POST /transactions** - Instant USD transfers to contractors
- **GET /stats** - Real-time analytics on payment volume and activity

### Features
- 🏦 **Wallet Management** - Create and manage USD wallets
- 💸 **Instant Transfers** - Send USD to contractor wallets
- 🔄 **Crypto-to-Fiat** - Seamless conversion from MNEE to USD
- 📊 **Analytics Dashboard** - Track transaction history and volume

Implementation files:
- `services/auraInfraService.ts` - AURA API integration
- `components/AuraWalletPanel.tsx` - USD wallet UI
- `types.ts` - Fiat wallet and transaction types

---

## 🎯 Future Enhancements

- [ ] Real blockchain integration with MNEE network
- [ ] Live AURA Infra API integration with authentication
- [ ] Agent reputation and rating system
- [ ] Multi-session chat history
- [ ] More specialized agent types
- [ ] Agent-to-agent collaboration
- [ ] Automatic crypto-to-fiat conversion on payment receipt

---

## 🔌 Third-Party APIs & SDKs

This project uses the following third-party services and SDKs:

### Google Gemini API (AI)
- **Purpose**: Powers AI agent conversations and responses
- **SDK**: `@google/genai` (npm package)
- **Model**: `gemini-2.5-flash`
- **License**: Apache 2.0
- **Rights**: Developer has valid API key and usage rights from Google AI Studio
- **Documentation**: https://ai.google.dev/

### MNEE Sandbox API (Optional)
- **Purpose**: Attempts to fetch live MNEE network configuration
- **Endpoint**: `https://sandbox-proxy-api.mnee.net/v1/config`
- **License**: Public API
- **Rights**: Publicly accessible endpoint for hackathon participants
- **Fallback**: Graceful degradation to offline config if unavailable

### AURA Infra API (Fiat Payments)
- **Purpose**: Bridges crypto and traditional finance for agent-to-contractor payments
- **Endpoint**: `https://api.nanilabs.io`
- **Documentation**: https://nanilabs.io
- **License**: Commercial API (demo mode in this project)
- **Rights**: Integration uses simulated/mock data for demonstration
- **Features**: USD wallet creation, instant transfers, payment analytics

### Lucide React (Icons)
- **Purpose**: UI icons
- **License**: ISC License (permissive open-source)
- **Rights**: Free to use under ISC license

**All third-party services are used in accordance with their respective terms of service and licenses.**

---

## 📜 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **MNEE Network** for the hackathon opportunity
- **AURA Infra / NaniLabs** for fiat payment infrastructure collaboration
- **Google Gemini** for powerful AI capabilities
- **Lucide** for beautiful icons
  hello

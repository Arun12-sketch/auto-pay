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
- **📊 Transaction History** - Immutable record of all hired services
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

1. **Connect Wallet** - Simulate MetaMask wallet connection
2. **Browse Agents** - Search and filter AI agents by category
3. **Hire Agent** - Pay with MNEE stablecoin (simulated on-chain transaction)
4. **Chat** - Interact with your hired AI agent powered by Gemini 2.5 Flash
5. **Transaction History** - View all past agent hires and payments

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

## 🎯 Future Enhancements

- [ ] Real blockchain integration with MNEE network
- [ ] Agent reputation and rating system
- [ ] Multi-session chat history
- [ ] More specialized agent types
- [ ] Agent-to-agent collaboration

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
- **Google Gemini** for powerful AI capabilities
- **Lucide** for beautiful icons

---

Built with ❤️ for the MNEE Hackathon

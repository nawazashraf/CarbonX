# 🍀 CarbonX: Decentralized Carbon Credit Registry & Marketplace

CarbonX is an institutional-grade, Web3-enabled Decentralized Carbon Credit Registry and Marketplace built on the **Base Sepolia Testnet**. It enables developers to register ecological projects, verified auditors to issue cryptographic carbon offset signatures, and institutions to trade or retire carbon credits with real-time analytics.

---

## 🏗️ Repository Architecture

CarbonX is organized as a monorepo structured for simplified local development and production hosting:

```
CarbonX/
├── client/          # Next.js 16 (App Router) client with Wagmi/Viem
├── server/          # Node/Express API server with Mongoose & MongoDB
├── contracts/       # Solidity Smart Contracts (ERC20 token & Marketplace)
└── package.json     # Root orchestrator for monorepo installs & builds
```

---

## ✨ Key Features

1. **Decentralized Project Registry**: Ecological project creators can request carbon credits by submitting geographical data and canopy metrics.
2. **Cryptographic Auditing**: Authorized verifiers sign audits off-chain to mint credits into existence on the registry database.
3. **Direct USDC Settlements**: Buyers purchase carbon listings using real testnet USDC. The smart contracts secure approvals, and tokens are transferred directly to the seller's Web3 wallet.
4. **Institutional Dashboard**: Track active holdings, retirement records, and portfolio sector allocations (Forestry, Ocean, Energy) with real-time SVG charting.
5. **Single-Process Render Hosting**: The Express server is configured to compile and host the Next.js frontend on the same port, removing CORS issues and reducing hosting costs.

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your system:
*   [Node.js (v18+)](https://nodejs.org/)
*   [MongoDB](https://www.mongodb.com/) (running locally or a Mongo Atlas URL)
*   A Web3 wallet (e.g., MetaMask) connected to the **Base Sepolia Testnet**

### 2. Environment Variables Setup

#### Backend (`server/.env`):
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/carbonx
CLIENT_URL=http://localhost:3000
```

#### Frontend (`client/.env.local`):
Create a `.env.local` file in the `client` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Local Installation & Development

To install dependencies for all directories in a single command, run the following from the root directory:
```bash
npm install
```

To run both servers concurrently for development:
```bash
# In one terminal tab:
cd server && npm run dev

# In another terminal tab:
cd client && npm run dev
```

The frontend will run on `http://localhost:3000` and the API backend on `http://localhost:5000`.

---

## 📦 Production & Render Deployment Guide

CarbonX is pre-configured to be hosted on **Render** (or any similar Node.js cloud provider) as a single service.

### Render Web Service Settings:
*   **Build Command**: `npm run build` *(installs all dependencies and builds the Next.js bundle)*
*   **Start Command**: `npm start` *(starts the Express backend which serves both API and frontend)*
*   **Environment Variables**:
    *   `NODE_ENV`: `production`
    *   `MONGO_URI`: `your_mongodb_atlas_connection_string`

The Express process will prepare the Next.js app in the background and pipe all client routes through the request handler, ensuring dynamic paths work perfectly.

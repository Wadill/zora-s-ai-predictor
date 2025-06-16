# Zora-ai Predictor

**Zora-ai Predictor** is a revolutionary Web3 application built for the **Zora WaveHack** to empower creators and traders on the Zora platform. It leverages the **Zora Coins SDK** and **AI-driven analytics** to forecast the potential value of social media posts based on historical coin performance.

With a sleek, animated interface and seamless wallet integration, Zora-ai Predictor helps creators optimize their posting strategy for maximum impact in the decentralized content economy.

🚀 **Deployed on Base Mainnet**, it's a game-changer for Web3 content monetization.

---

## 🖼️ Demo

<!-- Replace with actual demo GIF or screenshot -->
> 📽️ [Watch Demo Video](#)  
> Connect wallet → Predict post value → Explore trending coins.

---

## ✨ Features

- **Post Value Prediction**  
  Uses `getCoin` and `getCoinComments` from Zora Coins SDK to analyze market cap, trading volume, and engagement—then predicts post value with AI-driven insights.

- **Optimal Posting Times**  
  Recommends best times to post based on historical engagement trends.

- **Trending Coins Display**  
  Showcases top-performing coins via `getCoinsTopGainers`.

- **Wallet Integration**  
  Connect seamlessly with MetaMask via WAGMI and Viem on Base mainnet.

- **Modern UI**  
  Built with React, TypeScript, Tailwind CSS, and Framer Motion for responsive, animated UX.

---

## 💡 Why It Matters

Zora-ai Predictor addresses a key pain point: creators not knowing which posts will drive coin value or engagement. By combining **Zora’s blockchain tech** with **AI analytics**, this tool makes content creation data-driven and profitable.

> Built to align with **Zora’s mission** of decentralized content monetization and deployed on **Base** for scalability.

---

## 🧠 Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion  
- **Blockchain**: Zora Coins SDK, WAGMI, Viem  
- **Chain**: Base Mainnet (Chain ID: `8453`)  
- **Data Fetching**: `@tanstack/react-query`  
- **Build Tools**: CRA, npm, Webpack  

---

## ⚙️ Prerequisites

- Node.js (v18+), npm (v8+)
- A MetaMask wallet
- Zora API key (get from [Zora Dev Settings](https://zora.co))
- RPC URL for Base mainnet (e.g., from Infura or use `https://mainnet.base.org`)

---

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/zora-ai-predictor.git
cd zora-ai-predictor

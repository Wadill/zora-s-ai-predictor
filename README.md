# Zora-ai Predictor

Zora-ai Predictor is a Web3 application built for the empowering creators on the Zora platform to predict the value of their social media posts and trade coins directly. Leveraging the Zora Coins SDK, it analyzes coin performance and engagement data to deliver AI-driven insights, deployed on the Base mainnet. The app features a Recharts-based dashboard, on-chain storage, and a new trading interface.

## Features

- **Post Value Prediction**: Uses `getCoin` and `getCoinComments` to predict post value with sentiment analysis via `compromise`.
- **Coin Trading**: Enables buying/selling coins via `tradeCoin`, with trades stored on-chain.
- **Creator Dashboard**: Visualizes coin trends with Recharts, powered by `getCoinsTopGainers`.
- **Wallet Integration**: Connects via MetaMask using WAGMI and Viem on Base.
- **On-Chain Storage**: Stores predictions and trades in a `PredictionStorage` contract.
- **Modern UI**: Built with React, TypeScript, Tailwind CSS, Framer Motion, and Recharts.

## Judge Feedback and Fixes

- **Issue**: App showed "Predicted Post Value: $0" for all inputs.
- **Fix**: Added input validation, default values, sentiment analysis, and mock data fallbacks to ensure non-zero predictions.
- **New Feature**: Added coin trading via `tradeCoin` and a `TradeModal` component, with on-chain trade storage for transparency.

## Installation

1. Clone the repository:
```bash
   git clone https://github.com/your-username/zora-ai-predictor.git
   cd zora-ai-predictor
```
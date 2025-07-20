export interface Zora20Token {
  address: string;
  name?: string;
  symbol?: string;
  marketCap?: string;
  volume24h?: string;
  marketCapDelta24h?: string;
}

export interface Prediction {
  user: string;
  coinAddress: string;
  predictedValue: number;
  postTime: string;
  timestamp: number;
}

export interface Trade {
  user: string;
  coinAddress: string;
  amount: number;
  isBuy: boolean;
  timestamp: number;
}
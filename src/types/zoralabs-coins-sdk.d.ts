declare module '@zoralabs/coins-sdk';

export interface Zora20Token {
  address: string;
  name?: string;
  symbol?: string;
  marketCap?: string;
  volume24h?: string;
  marketCapDelta24h?: string;
}
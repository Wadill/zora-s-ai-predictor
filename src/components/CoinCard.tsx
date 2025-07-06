import React from 'react';

interface CoinCardProps {
  coin: { name: string; symbol: string; marketCap: string; volume24h: string };
}

export const CoinCard: React.FC<CoinCardProps> = ({ coin }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold">{coin.name} ({coin.symbol})</h3>
      <p>Market Cap: ${coin.marketCap}</p>
      <p>24h Volume: ${coin.volume24h}</p>
    </div>
  );
};
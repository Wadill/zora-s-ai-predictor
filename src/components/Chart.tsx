import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCoinData } from '../hooks/useCoinData';
import { Zora20Token } from '../types';
import { formatEther } from 'viem';

const Chart: React.FC = () => {
  const { coins, error, loading } = useCoinData();

  if (loading) return <div className="text-center">Loading chart...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  console.log('Coins data:', coins);

  const data = coins.map((coin: Zora20Token) => {
    const marketCap = coin.marketCap ? Math.floor(Number(coin.marketCap)).toString() : '1000000000000000000';
    const volume24h = coin.volume24h ? Math.floor(Number(coin.volume24h)).toString() : '0';

    return {
      name: coin.symbol || 'Unknown',
      marketCap: marketCap !== '0' ? Number(formatEther(BigInt(marketCap))) : 1,
      volume24h: volume24h !== '0' ? Number(formatEther(BigInt(volume24h))) : 0,
    };
  });

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#ffffff" />
          <YAxis stroke="#ffffff" />
          <Tooltip />
          <Area type="monotone" dataKey="marketCap" stackId="1" stroke="#8884d8" fill="#8884d8" />
          <Area type="monotone" dataKey="volume24h" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
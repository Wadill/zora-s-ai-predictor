import React, { useState, useEffect } from 'react';
import { getCoinsTopGainers } from '@zoralabs/coins-sdk';
import { motion } from 'framer-motion';

const CoinList: React.FC = () => {
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopGainers = async () => {
      try {
        const response = await getCoinsTopGainers({
          count: 5,
        });
        const tokens = response.data?.exploreList?.edges?.map((edge: any) => edge.node) || [];
        setCoins(tokens);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch coins');
      } finally {
        setLoading(false);
      }
    };

    fetchTopGainers();
  }, []);

  return (
    <section>
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Trending Coins
      </motion.h2>
      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coins.map((coin, index) => (
          <motion.div
            key={coin.address}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 p-4 rounded-lg shadow"
          >
            <h3 className="text-xl font-semibold">{coin.name} ({coin.symbol})</h3>
            <p>Market Cap: ${coin.marketCap || 'N/A'}</p>
            <p>24h Volume: ${coin.volume24h || 'N/A'}</p>
            <p>24h Change: {coin.marketCapDelta24h ? `${parseFloat(coin.marketCapDelta24h).toFixed(2)}%` : 'N/A'}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CoinList;
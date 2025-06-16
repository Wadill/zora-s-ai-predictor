import React, { useState } from 'react';
import { getCoin, getCoinComments } from '@zoralabs/coins-sdk';
import { Address } from 'viem';
import { motion } from 'framer-motion';

const PostPredictor: React.FC = () => {
  const [coinAddress, setCoinAddress] = useState('');
  const [postTime, setPostTime] = useState('');
  const [prediction, setPrediction] = useState<{
    value: number;
    bestTime: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const predictPostValue = async () => {
    if (!coinAddress || !postTime) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch coin data
      const coinResponse = await getCoin({
        address: coinAddress as Address,
        chain: 8453, // Base mainnet
      });

      const coin = coinResponse.data?.zora20Token;
      if (!coin) {
        throw new Error('Coin not found');
      }

      // Fetch comments for engagement data
      const commentsResponse = await getCoinComments({
        address: coinAddress as Address,
        chain: 8453,
        count: 50,
      });

      const commentCount = commentsResponse.data?.zora20Token?.zoraComments?.edges?.length || 0;

      // Simulated prediction logic
      const engagementScore = commentCount * 0.1 + Number(coin.volume24h || 0) * 0.0001;
      const marketCapInfluence = Number(coin.marketCap || 0) * 0.00001;
      const predictedValue = engagementScore + marketCapInfluence;

      // Simulated best posting time (based on historical activity peaks)
      const postHour = new Date(postTime).getHours();
      const optimalHour = postHour < 12 ? 'Evening (6-9 PM)' : 'Morning (9-11 AM)';

      setPrediction({
        value: Math.round(predictedValue * 100) / 100,
        bestTime: optimalHour,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch coin data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mb-12">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Predict Your Post's Value
      </motion.h2>
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Coin Address</label>
          <input
            type="text"
            value={coinAddress}
            onChange={(e) => setCoinAddress(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded text-white"
            placeholder="0x..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Planned Post Time</label>
          <input
            type="datetime-local"
            value={postTime}
            onChange={(e) => setPostTime(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 rounded text-white"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={predictPostValue}
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Predicting...' : 'Predict Value'}
        </motion.button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {prediction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-gray-700 rounded"
          >
            <p className="text-lg">
              Predicted Post Value: <span className="font-bold">${prediction.value}</span>
            </p>
            <p className="text-lg">
              Best Time to Post: <span className="font-bold">{prediction.bestTime}</span>
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PostPredictor;
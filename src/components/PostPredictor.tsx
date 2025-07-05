import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getCoin, getCoinComments } from '@zoralabs/coins-sdk';
import { formatEther } from 'viem';

const PostPredictor: React.FC = () => {
  const [coinAddress, setCoinAddress] = useState('');
  const [postTime, setPostTime] = useState('');
  const [predictedValue, setPredictedValue] = useState(0);
  const [bestTime, setBestTime] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    setError(null);
    try {
      // Fetch coin data
      const coinResponse = await getCoin({ address: coinAddress, chain: 8453 });
      const commentsResponse = await getCoinComments({ address: coinAddress, chain: 8453, count: 100 });

      const coinData = coinResponse.data?.zora20Token;
      const comments = commentsResponse.data?.zora20Token?.zoraComments?.edges || [];

      if (!coinData || !coinData.marketCap) {
        setError('Invalid coin data or market cap not available');
        return;
      }

      // Simple prediction logic (to be improved)
      const marketCap = Number(formatEther(BigInt(coinData.marketCap || '0')));
      const engagementScore = comments.length * 0.1; // Example: 0.1 per comment
      const predicted = marketCap * engagementScore * 0.01; // Simplified formula

      setPredictedValue(predicted);
      setBestTime(new Date(postTime).toLocaleString()); // Placeholder
    } catch (err: any) {
      setError(err.message || 'Failed to fetch prediction data');
      setPredictedValue(0);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold mb-4">Predict Post Value</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter Zora coin address"
          value={coinAddress}
          onChange={(e) => setCoinAddress(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded text-white"
        />
        <input
          type="datetime-local"
          value={postTime}
          onChange={(e) => setPostTime(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded text-white"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePredict}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Predict Value
        </motion.button>
      </div>
      <p className="mt-4">Predicted Post Value: ${predictedValue.toFixed(2)}</p>
      <p>Best Posting Time: {bestTime || 'Not calculated'}</p>
    </motion.div>
  );
};

export default PostPredictor;
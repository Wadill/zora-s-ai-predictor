import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getCoin, getCoinComments } from '@zoralabs/coins-sdk';
import { formatEther } from 'viem';
import nlp from 'compromise';
import { useStorePrediction } from '../hooks/useContract';

const PostPredictor: React.FC = () => {
  const [coinAddress, setCoinAddress] = useState('');
  const [postTime, setPostTime] = useState('');
  const [predictedValue, setPredictedValue] = useState(0);
  const [bestTime, setBestTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { write, error: contractError } = useStorePrediction();

  const handlePredict = async () => {
    setError(null);
    setLoading(true);

    // Validate Ethereum address
    if (!/^0x[a-fA-F0-9]{40}$/.test(coinAddress)) {
      setError('Invalid Ethereum address');
      setPredictedValue(0);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching coin for address:', coinAddress);
      const coinResponse = await getCoin({ address: coinAddress, chain: 8453 });
      const commentsResponse = await getCoinComments({ address: coinAddress, chain: 8453, count: 100 });

      console.log('Coin response:', coinResponse);
      console.log('Comments response:', commentsResponse);

      const coinData = coinResponse.data?.zora20Token;
      const comments = commentsResponse.data?.zora20Token?.zoraComments?.edges || [];

      if (!coinData || !coinData.marketCap) {
        setError('Invalid coin data or market cap not available');
        setPredictedValue(0);
        setLoading(false);
        return;
      }

      // Enhanced prediction logic
      const marketCap = Number(formatEther(BigInt(coinData.marketCap || '1000000000000000000'))); // Default 1 ETH
      const volume24h = Number(formatEther(BigInt(coinData.volume24h || '0')));
      const marketCapDelta = Number(coinData.marketCapDelta24h || '0');
      const engagementScore = comments.reduce((score, edge) => {
        const doc = nlp(edge.node.comment);
        const sentiment = doc.sentiment().score; // -1 to 1
        return score + (0.1 + sentiment * 0.1); // Adjust by sentiment
      }, 1); // Minimum score of 1

      const timeFactor = postTime ? 1 + Math.abs(Math.sin(new Date(postTime).getHours() / 12)) : 1;
      const predicted = (marketCap * 0.5 + volume24h * 0.3 + marketCapDelta * 0.2) * engagementScore * timeFactor;
      console.log('Prediction inputs:', { marketCap, volume24h, marketCapDelta, engagementScore, timeFactor, predicted });

      setPredictedValue(predicted);
      setBestTime(calculateBestTime(comments));

      // Store prediction on-chain
      if (write) {
        write({ args: [coinAddress, Math.floor(predicted * 100), postTime || new Date().toISOString()] });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch prediction data');
      console.log('Error:', err);
      setPredictedValue(0);
    } finally {
      setLoading(false);
    }
  };

  const calculateBestTime = (comments: any[]) => {
    if (!comments.length) return new Date().toLocaleString();
    const hours = comments.map(c => new Date(c.node.timestamp).getHours());
    const peakHour = hours.sort((a, b) => hours.filter(h => h === a).length - hours.filter(h => h === b).length).pop();
    const bestDate = new Date();
    bestDate.setHours(peakHour || 12);
    return bestDate.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
    >
      <h2 className="text-2xl font-semibold mb-4">Predict Post Value</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {contractError && <p className="text-red-500 mb-4">Contract Error: {contractError.message}</p>}
      {loading && <p className="text-center mb-4">Calculating prediction...</p>}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Enter Zora coin address (e.g., 0x123...)"
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
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
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
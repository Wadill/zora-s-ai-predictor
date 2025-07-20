import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import nlp from 'compromise';
import { useStorePrediction } from '../hooks/useContract';
import TradeModal from './TradeModal';
import { Info } from 'react-feather';
import { trainPredictionModel, predictPostValue } from '../ai/predictionModel';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';

const PostPredictor: React.FC = () => {
  const [coinAddress, setCoinAddress] = useState('');
  const [postTime, setPostTime] = useState('');
  const [predictedValue, setPredictedValue] = useState(0);
  const [bestTime, setBestTime] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [model, setModel] = useState<tf.Sequential | null>(null);

  const { write: writePrediction, error: contractError } = useStorePrediction();

  useEffect(() => {
    // Train model with mock data (replace with real data in production)
    const trainModel = async () => {
      const mockData = {
        marketCaps: [1, 2, 1.5, 3], // ETH
        volumes: [0.5, 0.75, 0.6, 1], // ETH
        deltas: [5, 3, 4, 6], // %
        sentiments: [0.5, 0.3, 0.4, 0.6], // -1 to 1
        postValues: [100, 200, 150, 300], // USD
      };
      const trainedModel = await trainPredictionModel(mockData);
      setModel(trainedModel);
    };
    trainModel();
  }, []);

  const handlePredict = async () => {
    setError(null);
    setLoading(true);

    if (!/^0x[a-fA-F0-9]{40}$/.test(coinAddress)) {
      setError('Invalid Ethereum address');
      setPredictedValue(0);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching coin data from backend:', coinAddress);
      const response = await axios.get(`http://localhost:5000/api/coin/${coinAddress}`);
      const { coinData, comments } = response.data;

      if (!coinData || !coinData.marketCap) {
        setError('Invalid coin data or market cap not available');
        setPredictedValue(0);
        setLoading(false);
        return;
      }

      const engagementScore = comments.reduce((score: number, edge: any) => {
        const doc = nlp(edge.node.comment);
        const sentiment = doc.sentiment().score;
        return score + (0.1 + sentiment * 0.1);
      }, 1);

      const timeFactor = postTime ? 1 + Math.abs(Math.sin(new Date(postTime).getHours() / 12)) : 1;

      if (model) {
        const predicted = await predictPostValue(model, coinData, engagementScore, timeFactor);
        setPredictedValue(predicted);

        // Save to backend
        await axios.post('http://localhost:5000/api/predict', {
          user: '0xUserAddress', // Replace with connected wallet address
          coinAddress,
          predictedValue: predicted,
          postTime: postTime || new Date().toISOString(),
        });

        // Save to blockchain
        if (writePrediction) {
          writePrediction({ args: [coinAddress, Math.floor(predicted * 100), postTime || new Date().toISOString()] });
        }
      }

      setBestTime(calculateBestTime(comments));
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
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-semibold">Predict Post Value</h2>
        <div className="relative ml-2">
          <Info
            size={20}
            className="text-gray-400 cursor-pointer"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          />
          {showTooltip && (
            <div className="absolute z-10 bg-gray-700 text-white text-sm p-2 rounded shadow-lg w-64">
              Use predictions to optimize your posting strategy:
              <ul className="list-disc pl-4">
                <li>Post at the recommended time to maximize engagement.</li>
                <li>Target coins with high predicted value for promotion.</li>
                <li>Trade coins based on predictions to capitalize on trends.</li>
                <li>Track predictions on-chain for transparency.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
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
        <div className="flex space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePredict}
            disabled={loading || !model}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Predict Value
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTradeModal(true)}
            disabled={!coinAddress || !/^0x[a-fA-F0-9]{40}$/.test(coinAddress)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Trade Coin
          </motion.button>
        </div>
      </div>
      <p className="mt-4">Predicted Post Value: ${predictedValue.toFixed(2)}</p>
      <p>Best Posting Time: {bestTime || 'Not calculated'}</p>
      {showTradeModal && (
        <TradeModal
          coinAddress={coinAddress}
          predictedValue={predictedValue}
          onClose={() => setShowTradeModal(false)}
        />
      )}
    </motion.div>
  );
};

export default PostPredictor;
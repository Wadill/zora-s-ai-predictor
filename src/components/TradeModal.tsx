import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { tradeCoin } from '@zoralabs/coins-sdk';
import { useStoreTrade } from '../hooks/useContract';
import { X } from 'react-feather';
import axios from 'axios';

interface TradeModalProps {
  coinAddress: string;
  predictedValue: number;
  onClose: () => void;
}

const TradeModal: React.FC<TradeModalProps> = ({ coinAddress, predictedValue, onClose }) => {
  const [amount, setAmount] = useState('');
  const [isBuy, setIsBuy] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { write: writeTrade, error: contractError } = useStoreTrade();

  const handleTrade = async () => {
    setError(null);
    setLoading(true);

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      setLoading(false);
      return;
    }

    try {
      console.log('Trading coin:', { coinAddress, amount, isBuy });
      const response = await tradeCoin({
        coinAddress,
        amount: (Number(amount) * 1e18).toString(),
        isBuy,
        chain: 8453,
      });
      console.log('Trade response:', response);

      // Save to backend
      await axios.post('http://localhost:5000/api/trade', {
        user: '0xUserAddress', // Replace with connected wallet address
        coinAddress,
        amount: Number(amount) * 1e18,
        isBuy,
      });

      // Save to blockchain
      if (writeTrade) {
        writeTrade({ args: [coinAddress, Math.floor(Number(amount) * 1e18), isBuy] });
      }

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to execute trade');
      console.log('Trade error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Trade Coin</h2>
          <X className="cursor-pointer" onClick={onClose} />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {contractError && <p className="text-red-500 mb-4">Contract Error: {contractError.message}</p>}
        {loading && <p className="text-center mb-4">Processing trade...</p>}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Coin Address</label>
            <input
              type="text"
              value={coinAddress}
              disabled
              className="w-full p-2 bg-gray-700 rounded text-white opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount (ETH)</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trade Type</label>
            <select
              value={isBuy ? 'buy' : 'sell'}
              onChange={(e) => setIsBuy(e.target.value === 'buy')}
              className="w-full p-2 bg-gray-700 rounded text-white"
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>
          <p className="text-sm">Predicted Post Value: ${predictedValue.toFixed(2)}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleTrade}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
          >
            Execute Trade
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TradeModal;
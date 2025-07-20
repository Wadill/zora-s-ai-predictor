import express from 'express';
import { fetchAndCacheCoinData, fetchTopGainers, savePrediction, saveTrade } from '../services/zoraService';

const router = express.Router();

router.post('/predict', async (req, res) => {
  try {
    const { user, coinAddress, predictedValue, postTime } = req.body;
    if (!user || !coinAddress || !predictedValue || !postTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const prediction = await savePrediction({ user, coinAddress, predictedValue, postTime });
    res.json(prediction);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save prediction' });
  }
});

router.post('/trade', async (req, res) => {
  try {
    const { user, coinAddress, amount, isBuy } = req.body;
    if (!user || !coinAddress || !amount || isBuy === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const trade = await saveTrade({ user, coinAddress, amount, isBuy });
    res.json(trade);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to save trade' });
  }
});

router.get('/coin/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const data = await fetchAndCacheCoinData(address);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch coin data' });
  }
});

router.get('/top-gainers', async (req, res) => {
  try {
    const coins = await fetchTopGainers();
    res.json(coins);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch top gainers' });
  }
});

export default router;
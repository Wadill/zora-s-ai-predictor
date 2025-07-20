import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import apiRoutes from './routes/api';
import { setApiKey } from '@zoralabs/coins-sdk';

const app = express();

app.use(cors());
app.use(express.json());

const initializeZoraSDK = () => {
  const apiKey = process.env.ZORA_API_KEY;
  if (!apiKey) {
    console.error('Zora API key is missing');
    return;
  }
  setApiKey(apiKey);
};

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zora-ai-predictor');
    console.log('Connected to MongoDB');
    initializeZoraSDK();
    app.use('/api', apiRoutes);
    app.listen(5000, () => console.log('Server running on port 5000'));
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
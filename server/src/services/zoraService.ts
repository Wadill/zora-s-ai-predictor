import { getCoin, getCoinComments, getCoinsTopGainers } from '@zoralabs/coins-sdk';
import mongoose from 'mongoose';
import { Prediction } from '../models/Prediction';
import { Trade } from '../models/Trade';

export const fetchAndCacheCoinData = async (coinAddress: string) => {
  const coinResponse = await getCoin({ address: coinAddress, chain: 8453 });
  const commentsResponse = await getCoinComments({ address: coinAddress, chain: 8453, count: 100 });

  const coinData = coinResponse.data?.zora20Token;
  const comments = commentsResponse.data?.zora20Token?.zoraComments?.edges || [];

  // Cache in MongoDB (simplified, could use a separate collection)
  await Prediction.updateOne(
    { coinAddress },
    { $set: { coinData, comments, timestamp: Date.now() } },
    { upsert: true }
  );

  return { coinData, comments };
};

export const fetchTopGainers = async () => {
  const response = await getCoinsTopGainers({ count: 5 });
  const coins = response.data?.exploreList?.edges?.map((edge: any) => edge.node) || [];
  return coins;
};

export const savePrediction = async (prediction: {
  user: string;
  coinAddress: string;
  predictedValue: number;
  postTime: string;
}) => {
  const newPrediction = new Prediction({
    ...prediction,
    timestamp: Date.now(),
  });
  await newPrediction.save();
  return newPrediction;
};

export const saveTrade = async (trade: {
  user: string;
  coinAddress: string;
  amount: number;
  isBuy: boolean;
}) => {
  const newTrade = new Trade({
    ...trade,
    timestamp: Date.now(),
  });
  await newTrade.save();
  return newTrade;
};
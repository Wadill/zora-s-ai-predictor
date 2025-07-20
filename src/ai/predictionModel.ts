import * as tf from '@tensorflow/tfjs';
import { formatEther } from 'viem';

export const trainPredictionModel = async (data: {
  marketCaps: number[];
  volumes: number[];
  deltas: number[];
  sentiments: number[];
  postValues: number[];
}) => {
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [4] }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));

  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

  const xs = tf.tensor2d(
    data.marketCaps.map((mc, i) => [mc, data.volumes[i], data.deltas[i], data.sentiments[i]]),
    [data.marketCaps.length, 4]
  );
  const ys = tf.tensor2d(data.postValues, [data.postValues.length, 1]);

  await model.fit(xs, ys, { epochs: 50, batchSize: 32 });

  xs.dispose();
  ys.dispose();

  return model;
};

export const predictPostValue = async (
  model: tf.Sequential,
  coinData: { marketCap?: string; volume24h?: string; marketCapDelta24h?: string },
  sentiment: number,
  timeFactor: number
) => {
  const marketCap = Number(formatEther(BigInt(coinData.marketCap || '1000000000000000000')));
  const volume24h = Number(formatEther(BigInt(coinData.volume24h || '0')));
  const marketCapDelta = Number(coinData.marketCapDelta24h || '0');

  const input = tf.tensor2d([[marketCap, volume24h, marketCapDelta, sentiment]], [1, 4]);
  const prediction = model.predict(input) as tf.Tensor;
  const result = (await prediction.data())[0] * timeFactor;

  input.dispose();
  prediction.dispose();

  return Math.max(result, 0); // Ensure non-negative prediction
};
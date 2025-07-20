import mongoose, { Schema } from 'mongoose';

interface IPrediction {
  user: string;
  coinAddress: string;
  predictedValue: number;
  postTime: string;
  timestamp: number;
}

const PredictionSchema = new Schema<IPrediction>({
  user: { type: String, required: true },
  coinAddress: { type: String, required: true },
  predictedValue: { type: Number, required: true },
  postTime: { type: String, required: true },
  timestamp: { type: Number, required: true },
});

export const Prediction = mongoose.model<IPrediction>('Prediction', PredictionSchema);
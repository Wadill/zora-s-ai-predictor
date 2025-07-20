import mongoose, { Schema } from 'mongoose';

interface ITrade {
  user: string;
  coinAddress: string;
  amount: number;
  isBuy: boolean;
  timestamp: number;
}

const TradeSchema = new Schema<ITrade>({
  user: { type: String, required: true },
  coinAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  isBuy: { type: Boolean, required: true },
  timestamp: { type: Number, required: true },
});

export const Trade = mongoose.model<ITrade>('Trade', TradeSchema);
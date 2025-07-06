import React from 'react';
import { motion } from 'framer-motion';
import { CoinCard } from './CoinCard';
import Chart from './Chart';
import { AlertsPanel } from './AlertsPanel';
import { BuzzScore } from './BuzzScore';
import { PortfolioManager } from './PortfolioManager';

const Dashboard: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 text-white"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Creator Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <CoinCard
          coin={{ name: 'Mock Coin', symbol: 'MCK', marketCap: '1M', volume24h: '50K' }}
        />
        <BuzzScore score={85} />
        <PortfolioManager />
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Chart />
        </div>
        <AlertsPanel />
      </div>
    </motion.div>
  );
};

export default Dashboard;
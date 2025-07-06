import React, { useEffect } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from './config/wagmi';
import { initializeZoraSDK } from './config/zora';
import Header from './components/Header';
import PostPredictor from './components/PostPredictor';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { motion } from 'framer-motion';

const queryClient = new QueryClient();

const App: React.FC = () => {
  useEffect(() => {
    initializeZoraSDK();
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gray-900 text-white">
          <Header />
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
          >
            <PostPredictor />
            <Dashboard />
          </motion.main>
          <Footer />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
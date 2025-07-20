import { useState, useEffect } from 'react';
import axios from 'axios';
import { Zora20Token } from '../types';

export const useCoinData = () => {
  const [coins, setCoins] = useState<Zora20Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/top-gainers');
        console.log('Top gainers response:', response.data);
        setCoins(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch coins');
        console.log('Error fetching coins:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, []);

  return { coins, loading, error };
};
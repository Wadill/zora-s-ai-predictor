import { useState, useEffect } from 'react';
import { getCoinsTopGainers } from '@zoralabs/coins-sdk';
import { Zora20Token } from '../types';

export const useCoinData = () => {
  const [coins, setCoins] = useState<Zora20Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await getCoinsTopGainers({ count: 5 });
        console.log('Top gainers response:', response);
        const fetchedCoins = response.data?.exploreList?.edges?.map((edge: any) => edge.node) || [];
        setCoins(fetchedCoins);
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
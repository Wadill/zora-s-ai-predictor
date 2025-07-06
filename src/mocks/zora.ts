export const getCoin = async (params: { address: string; chain?: number }) => {
  console.log('Mock getCoin called for:', params.address);
  return {
    data: {
      zora20Token: {
        name: 'Mock Coin',
        symbol: 'MCK',
        marketCap: '1000000000000000000', // 1 ETH
        volume24h: '500000000000000000', // 0.5 ETH
        marketCapDelta24h: '5',
      },
    },
  };
};

export const getCoinComments = async (params: { address: string; chain?: number; count?: number }) => {
  console.log('Mock getCoinComments called for:', params.address);
  return {
    data: {
      zora20Token: {
        zoraComments: {
          edges: [
            { node: { comment: 'Great coin!', timestamp: '2025-07-05T12:00:00Z' } },
            { node: { comment: 'HODL!', timestamp: '2025-07-05T13:00:00Z' } },
          ],
        },
      },
    },
  };
};

export const getCoinsTopGainers = async (params: { count?: number }) => ({
  data: {
    exploreList: {
      edges: [
        {
          node: {
            name: 'Mock Coin 1',
            symbol: 'MCK1',
            marketCap: '1000000000000000000', // 1 ETH
            volume24h: '500000000000000000', // 0.5 ETH
            marketCapDelta24h: '5',
          },
        },
        {
          node: {
            name: 'Mock Coin 2',
            symbol: 'MCK2',
            marketCap: '2000000000000000000', // 2 ETH
            volume24h: '750000000000000000', // 0.75 ETH
            marketCapDelta24h: '3',
          },
        },
      ],
    },
  },
});
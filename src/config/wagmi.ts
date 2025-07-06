import { createConfig, http } from 'wagmi';
import { base } from 'viem/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: {
    [base.id]: http(process.env.REACT_APP_RPC_URL || 'https://mainnet.base.org'),
  },
});
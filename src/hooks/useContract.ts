import { useContractWrite, usePrepareContractWrite } from 'wagmi';

export const useStorePrediction = () => {
  const { config, error: prepareError } = usePrepareContractWrite({
    address: '0xYourContractAddress', // Replace with deployed contract address
    abi: [
      {
        name: 'storePrediction',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'coinAddress', type: 'string' },
          { name: 'predictedValue', type: 'uint256' },
          { name: 'postTime', type: 'string' },
        ],
        outputs: [],
      },
    ],
    functionName: 'storePrediction',
  });

  const { write, error: writeError } = useContractWrite(config);

  return { write, error: prepareError || writeError };
};

export const useStoreTrade = () => {
  const { config, error: prepareError } = usePrepareContractWrite({
    address: '0xYourContractAddress', // Replace with deployed contract address
    abi: [
      {
        name: 'storeTrade',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
          { name: 'coinAddress', type: 'string' },
          { name: 'amount', type: 'uint256' },
          { name: 'isBuy', type: 'bool' },
        ],
        outputs: [],
      },
    ],
    functionName: 'storeTrade',
  });

  const { write, error: writeError } = useContractWrite(config);

  return { write, error: prepareError || writeError };
};
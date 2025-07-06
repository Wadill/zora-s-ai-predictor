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
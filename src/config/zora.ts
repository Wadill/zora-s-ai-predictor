import { setApiKey } from '@zoralabs/coins-sdk';

export const initializeZoraSDK = () => {
  const apiKey = process.env.REACT_APP_ZORA_API_KEY;
  if (!apiKey) {
    console.error('Zora API key is missing');
    return;
  }
  setApiKey(apiKey);
};
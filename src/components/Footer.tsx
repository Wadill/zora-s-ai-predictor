import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-4 mt-12">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; 2025 Zora-ai Predictor. Built for Zora Wavehack.</p>
        <a
          href="https://zora.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          Powered by Zora
        </a>
      </div>
    </footer>
  );
};

export default Footer;
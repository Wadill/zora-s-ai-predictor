import React from 'react';

interface BuzzScoreProps {
  score: number;
}

export const BuzzScore: React.FC<BuzzScoreProps> = ({ score }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-2">Buzz Score</h3>
      <p>Score: {score}/100</p>
    </div>
  );
};
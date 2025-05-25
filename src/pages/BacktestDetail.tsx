import React from 'react';
import { useParams } from 'react-router-dom';

const BacktestDetail = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Backtest Details</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600">Viewing backtest with ID: {id}</p>
      </div>
    </div>
  );
};

export default BacktestDetail;
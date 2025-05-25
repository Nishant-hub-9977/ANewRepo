import React from 'react';

const Strategies = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Trading Strategies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Strategy cards will be populated here */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No Strategies Yet</h2>
          <p className="text-gray-600">Create your first trading strategy to get started.</p>
        </div>
      </div>
    </div>
  );
};

export default Strategies;
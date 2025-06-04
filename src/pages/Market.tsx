import React from 'react';

function Market() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Market Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Market data will be populated here */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Market Summary</h2>
          <p className="text-gray-600">Market data and analysis will be displayed here.</p>
        </div>
      </div>
    </div>
  );
}

export default Market;

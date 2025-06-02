import React from 'react';

function Portfolio() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Portfolio</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Portfolio Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Portfolio Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Value</span>
              <span className="font-medium text-gray-900">$100,000.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Daily Change</span>
              <span className="font-medium text-green-600">+$1,250.00 (1.25%)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Return</span>
              <span className="font-medium text-green-600">+15.8%</span>
            </div>
          </div>
        </div>

        {/* Asset Allocation Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Asset Allocation</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Stocks</span>
              <span className="font-medium text-gray-900">60%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bonds</span>
              <span className="font-medium text-gray-900">30%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Cash</span>
              <span className="font-medium text-gray-900">10%</span>
            </div>
          </div>
        </div>

        {/* Risk Metrics Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Risk Metrics</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Volatility</span>
              <span className="font-medium text-gray-900">12.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Sharpe Ratio</span>
              <span className="font-medium text-gray-900">1.8</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Beta</span>
              <span className="font-medium text-gray-900">0.85</span>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-800 p-6 border-b">Holdings</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AAPL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">100</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$150.25</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$15,025.00</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+25.3%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">GOOGL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">50</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$2,800.75</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$140,037.50</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-2.1%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">MSFT</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">75</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$290.50</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$21,787.50</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+15.7%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
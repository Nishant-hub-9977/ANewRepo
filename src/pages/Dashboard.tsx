import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { LineChart, Briefcase, BarChart4, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import { format } from 'date-fns';

interface PortfolioSummary {
  current_balance: number;
  initial_balance: number;
  positions: Position[];
}

interface Position {
  symbol: string;
  quantity: number;
  current_price: number;
  entry_price: number;
  market_value: number;
  profit_loss: number;
  profit_loss_percent: number;
}

interface MarketSummary {
  indices: MarketIndex[];
  movers: MarketMover[];
}

interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: number;
}

interface MarketMover {
  symbol: string;
  name: string;
  price: number;
  change_percent: number;
}

interface RecentTrade {
  id: number;
  symbol: string;
  direction: string;
  quantity: number;
  price: number;
  executed_at: string;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummary | null>(null);
  const [recentTrades, setRecentTrades] = useState<RecentTrade[]>([]);

  // Mock data - in a real app, this would come from API
  const marketSummary: MarketSummary = {
    indices: [
      { symbol: 'SPY', name: 'S&P 500', price: 4985.23, change: 23.45, change_percent: 0.47 },
      { symbol: 'QQQ', name: 'Nasdaq', price: 17223.15, change: 126.82, change_percent: 0.74 },
      { symbol: 'DIA', name: 'Dow Jones', price: 38562.32, change: -42.15, change_percent: -0.11 }
    ],
    movers: [
      { symbol: 'AAPL', name: 'Apple Inc.', price: 187.32, change_percent: 2.8 },
      { symbol: 'TSLA', name: 'Tesla Inc.', price: 259.47, change_percent: -3.2 },
      { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 843.25, change_percent: 4.5 },
      { symbol: 'MSFT', name: 'Microsoft', price: 410.23, change_percent: 1.7 }
    ]
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // In a real implementation, these would be actual API calls
        // For this demo, we'll simulate a delay and use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setPortfolioSummary({
          current_balance: 12450.75,
          initial_balance: 10000,
          positions: [
            { symbol: 'AAPL', quantity: 10, current_price: 187.32, entry_price: 175.25, market_value: 1873.2, profit_loss: 120.7, profit_loss_percent: 6.9 },
            { symbol: 'MSFT', quantity: 5, current_price: 410.23, entry_price: 390.15, market_value: 2051.15, profit_loss: 100.4, profit_loss_percent: 5.15 },
            { symbol: 'NVDA', quantity: 2, current_price: 843.25, entry_price: 780.50, market_value: 1686.5, profit_loss: 125.5, profit_loss_percent: 8.04 }
          ]
        });
        
        setRecentTrades([
          { id: 1, symbol: 'AAPL', direction: 'buy', quantity: 5, price: 182.45, executed_at: '2023-05-12T14:32:10Z' },
          { id: 2, symbol: 'MSFT', direction: 'buy', quantity: 3, price: 395.20, executed_at: '2023-05-10T09:45:22Z' },
          { id: 3, symbol: 'TSLA', direction: 'sell', quantity: 2, price: 267.85, executed_at: '2023-05-05T11:20:45Z' }
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const calculateTotalPL = () => {
    if (!portfolioSummary) return 0;
    return portfolioSummary.current_balance - portfolioSummary.initial_balance;
  };

  const calculateTotalPLPercent = () => {
    if (!portfolioSummary) return 0;
    return ((portfolioSummary.current_balance - portfolioSummary.initial_balance) / portfolioSummary.initial_balance) * 100;
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Market overview and portfolio summary</p>
      </header>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm font-medium">Portfolio Value</h3>
            <div className="bg-blue-500/20 rounded-lg p-2">
              <Briefcase className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold">${portfolioSummary?.current_balance.toFixed(2)}</p>
            <div className={`flex items-center mt-1 ${calculateTotalPL() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {calculateTotalPL() >= 0 ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span className="text-sm">
                {calculateTotalPL() >= 0 ? '+' : ''}
                {calculateTotalPL().toFixed(2)} ({calculateTotalPLPercent().toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm font-medium">Active Positions</h3>
            <div className="bg-purple-500/20 rounded-lg p-2">
              <Activity className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold">{portfolioSummary?.positions.length || 0}</p>
            <p className="text-gray-400 text-sm mt-1">Active trading positions</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm font-medium">Market Sentiment</h3>
            <div className="bg-green-500/20 rounded-lg p-2">
              <LineChart className="h-5 w-5 text-green-400" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold">Bullish</p>
            <p className="text-gray-400 text-sm mt-1">Based on market indicators</p>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm font-medium">Strategies</h3>
            <div className="bg-amber-500/20 rounded-lg p-2">
              <BarChart4 className="h-5 w-5 text-amber-400" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold">3</p>
            <p className="text-gray-400 text-sm mt-1">Active trading strategies</p>
          </div>
        </div>
      </div>
      
      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
            
            <div className="space-y-4">
              <h3 className="text-gray-400 text-sm font-medium">Market Indices</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {marketSummary.indices.map((index) => (
                  <div key={index.symbol} className="bg-gray-700 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{index.name}</p>
                        <p className="text-lg font-semibold mt-1">{index.price.toFixed(2)}</p>
                      </div>
                      <div className={`text-right ${index.change_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        <p className="flex items-center justify-end">
                          {index.change_percent >= 0 ? (
                            <TrendingUp className="h-4 w-4 mr-1" />
                          ) : (
                            <TrendingDown className="h-4 w-4 mr-1" />
                          )}
                          {index.change_percent.toFixed(2)}%
                        </p>
                        <p className="text-sm mt-1">
                          {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <h3 className="text-gray-400 text-sm font-medium mt-6">Top Movers</h3>
              <div className="overflow-hidden rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Symbol</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Change</th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-700 divide-y divide-gray-600">
                    {marketSummary.movers.map((mover) => (
                      <tr key={mover.symbol} className="hover:bg-gray-600 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link to={`/market?symbol=${mover.symbol}`} className="text-blue-400 hover:text-blue-300">
                            {mover.symbol}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{mover.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">${mover.price.toFixed(2)}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${mover.change_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          <div className="flex items-center justify-end">
                            {mover.change_percent >= 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {mover.change_percent.toFixed(2)}%
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Portfolio Summary & Recent Activity */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Portfolio Summary</h2>
              <Link to="/portfolio" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
            </div>
            
            <div className="space-y-4">
              {portfolioSummary?.positions.map((position) => (
                <div key={position.symbol} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{position.symbol}</p>
                      <p className="text-gray-400 text-sm mt-1">{position.quantity} shares</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${position.current_price.toFixed(2)}</p>
                      <p className={`text-sm mt-1 ${position.profit_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.profit_loss >= 0 ? '+' : ''}${position.profit_loss.toFixed(2)} ({position.profit_loss_percent.toFixed(2)}%)
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Trades</h2>
              <Link to="/portfolio" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
            </div>
            
            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="flex items-center">
                        <span className={`mr-2 flex items-center justify-center h-6 w-6 rounded-full ${trade.direction === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {trade.direction === 'buy' ? '+' : '-'}
                        </span>
                        <p className="font-medium">{trade.symbol}</p>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">
                        {format(new Date(trade.executed_at), 'MMM d, yyyy HH:mm')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{trade.quantity} shares</p>
                      <p className="text-gray-400 text-sm mt-1">${trade.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
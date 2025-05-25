import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart4, Calendar, DollarSign, TrendingUp, TrendingDown, ChevronRight, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Backtest {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  final_capital: number;
  profit_loss: number;
  profit_loss_percent: number;
  max_drawdown: number;
  sharpe_ratio: number;
  created_at: string;
  strategy_id: number;
}

const Backtests: React.FC = () => {
  const [backtests, setBacktests] = useState<Backtest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBacktests = async () => {
      try {
        const response = await axios.get('/api/backtest/');
        setBacktests(response.data.backtests);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch backtests');
      } finally {
        setLoading(false);
      }
    };

    fetchBacktests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 text-red-400 p-4 rounded-lg flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Backtests</h1>
          <p className="text-gray-400 mt-1">View and analyze your strategy backtests</p>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm font-medium">Total Backtests</h3>
            <div className="bg-blue-500/20 rounded-lg p-2">
              <BarChart4 className="h-5 w-5 text-blue-400" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold">{backtests.length}</p>
            <p className="text-gray-400 text-sm mt-1">All-time backtests</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm font-medium">Best Performance</h3>
            <div className="bg-green-500/20 rounded-lg p-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-green-400">
              {backtests.length > 0
                ? `+${Math.max(...backtests.map(b => b.profit_loss_percent)).toFixed(2)}%`
                : '0%'}
            </p>
            <p className="text-gray-400 text-sm mt-1">Highest return</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm font-medium">Worst Performance</h3>
            <div className="bg-red-500/20 rounded-lg p-2">
              <TrendingDown className="h-5 w-5 text-red-400" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold text-red-400">
              {backtests.length > 0
                ? `${Math.min(...backtests.map(b => b.profit_loss_percent)).toFixed(2)}%`
                : '0%'}
            </p>
            <p className="text-gray-400 text-sm mt-1">Lowest return</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 text-sm font-medium">Average Return</h3>
            <div className="bg-purple-500/20 rounded-lg p-2">
              <DollarSign className="h-5 w-5 text-purple-400" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-semibold">
              {backtests.length > 0
                ? `${(backtests.reduce((acc, b) => acc + b.profit_loss_percent, 0) / backtests.length).toFixed(2)}%`
                : '0%'}
            </p>
            <p className="text-gray-400 text-sm mt-1">Mean performance</p>
          </div>
        </div>
      </div>

      {/* Backtests List */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Recent Backtests</h2>
        </div>

        {backtests.length === 0 ? (
          <div className="p-6 text-center text-gray-400">
            <BarChart4 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No backtests found</p>
            <p className="text-sm mt-2">Run your first backtest to see results here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Period</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Initial Capital</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Final Capital</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Return</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Sharpe Ratio</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Max Drawdown</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {backtests.map((backtest) => (
                  <tr key={backtest.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-500/20 rounded-lg p-2 mr-3">
                          <Calendar className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="font-medium">{backtest.name}</div>
                          <div className="text-sm text-gray-400">
                            {format(new Date(backtest.created_at), 'MMM d, yyyy')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="text-gray-300">
                        {format(new Date(backtest.start_date), 'MMM d, yyyy')}
                      </div>
                      <div className="text-gray-400">
                        to {format(new Date(backtest.end_date), 'MMM d, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-gray-300">${backtest.initial_capital.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-gray-300">${backtest.final_capital.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className={`font-medium ${backtest.profit_loss_percent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {backtest.profit_loss_percent >= 0 ? '+' : ''}
                        {backtest.profit_loss_percent.toFixed(2)}%
                      </div>
                      <div className="text-sm text-gray-400">
                        ${Math.abs(backtest.profit_loss).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-gray-300">{backtest.sharpe_ratio.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-red-400">{backtest.max_drawdown.toFixed(2)}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        to={`/backtests/${backtest.id}`}
                        className="text-blue-400 hover:text-blue-300 inline-flex items-center"
                      >
                        Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Backtests;
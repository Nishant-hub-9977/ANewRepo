import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, Save, Play, Trash2, ArrowLeft } from 'lucide-react';

interface Strategy {
  id: number;
  name: string;
  description: string;
  parameters: Record<string, any>;
  indicators: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const StrategyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [indicators, setIndicators] = useState<Record<string, any>>({});
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchStrategy = async () => {
      try {
        const response = await axios.get(`/api/strategy/${id}`);
        const strategyData = response.data.strategy;
        setStrategy(strategyData);
        
        // Initialize form state
        setName(strategyData.name);
        setDescription(strategyData.description || '');
        setParameters(strategyData.parameters || {});
        setIndicators(strategyData.indicators || {});
        setIsActive(strategyData.is_active);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch strategy');
      } finally {
        setLoading(false);
      }
    };

    fetchStrategy();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.put(`/api/strategy/${id}`, {
        name,
        description,
        parameters,
        indicators,
        is_active: isActive
      });
      
      setStrategy(response.data.strategy);
      setIsEditing(false);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update strategy');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this strategy?')) {
      return;
    }

    try {
      await axios.delete(`/api/strategy/${id}`);
      navigate('/strategies');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete strategy');
    }
  };

  const handleParameterChange = (key: string, value: any) => {
    setParameters(prev => ({ ...prev, [key]: value }));
  };

  const handleIndicatorChange = (key: string, value: any) => {
    setIndicators(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-300">Strategy not found</h2>
        <button
          onClick={() => navigate('/strategies')}
          className="mt-4 inline-flex items-center text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Strategies
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/strategies')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-white">{strategy.name}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                {saving ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </span>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 border border-gray-600 hover:border-gray-500 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                Edit Strategy
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center p-4 text-red-400 bg-red-900/20 rounded-lg">
          <AlertCircle className="w-5 h-5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strategy Details */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Strategy Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                ) : (
                  <p className="text-gray-300">{strategy.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                {isEditing ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                ) : (
                  <p className="text-gray-300">{strategy.description || 'No description provided'}</p>
                )}
              </div>
              
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    disabled={!isEditing}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-300">Active Strategy</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Parameters</h2>
            
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Symbol
                    </label>
                    <input
                      type="text"
                      value={parameters.symbol || ''}
                      onChange={(e) => handleParameterChange('symbol', e.target.value)}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Position Size (%)
                    </label>
                    <input
                      type="number"
                      value={parameters.position_size || ''}
                      onChange={(e) => handleParameterChange('position_size', Number(e.target.value))}
                      min="1"
                      max="100"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stop Loss (%)
                    </label>
                    <input
                      type="number"
                      value={parameters.stop_loss || ''}
                      onChange={(e) => handleParameterChange('stop_loss', Number(e.target.value))}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Take Profit (%)
                    </label>
                    <input
                      type="number"
                      value={parameters.take_profit || ''}
                      onChange={(e) => handleParameterChange('take_profit', Number(e.target.value))}
                      min="0"
                      max="1000"
                      step="0.1"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(strategy.parameters).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}
                    </label>
                    <p className="text-gray-300">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Indicators */}
        <div className="space-y-6">
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Technical Indicators</h2>
            
            {isEditing ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-3">Moving Averages</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Short MA Period
                      </label>
                      <input
                        type="number"
                        value={indicators.short_ma || ''}
                        onChange={(e) => handleIndicatorChange('short_ma', Number(e.target.value))}
                        min="1"
                        max="200"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Long MA Period
                      </label>
                      <input
                        type="number"
                        value={indicators.long_ma || ''}
                        onChange={(e) => handleIndicatorChange('long_ma', Number(e.target.value))}
                        min="1"
                        max="200"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-3">RSI</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        RSI Period
                      </label>
                      <input
                        type="number"
                        value={indicators.rsi_period || ''}
                        onChange={(e) => handleIndicatorChange('rsi_period', Number(e.target.value))}
                        min="1"
                        max="100"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        RSI Threshold
                      </label>
                      <input
                        type="number"
                        value={indicators.rsi_threshold || ''}
                        onChange={(e) => handleIndicatorChange('rsi_threshold', Number(e.target.value))}
                        min="0"
                        max="100"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-3">Moving Averages</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Short MA Period
                      </label>
                      <p className="text-gray-300">{strategy.indicators.short_ma || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Long MA Period
                      </label>
                      <p className="text-gray-300">{strategy.indicators.long_ma || 'Not set'}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-300 mb-3">RSI</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        RSI Period
                      </label>
                      <p className="text-gray-300">{strategy.indicators.rsi_period || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        RSI Threshold
                      </label>
                      <p className="text-gray-300">{strategy.indicators.rsi_threshold || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Performance</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Created
                </label>
                <p className="text-gray-300">
                  {new Date(strategy.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Last Updated
                </label>
                <p className="text-gray-300">
                  {new Date(strategy.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => navigate(`/backtests/new?strategy=${strategy.id}`)}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Play className="w-4 h-4 mr-2" />
                Run Backtest
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyDetail;
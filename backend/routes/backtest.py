from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.db import db
from models.backtest import Backtest
from models.strategy import Strategy
import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime

backtest_bp = Blueprint('backtest', __name__)

@backtest_bp.route('/', methods=['GET'])
@jwt_required()
def get_backtests():
    user_id = get_jwt_identity()
    
    # Get user's strategies
    strategies = Strategy.query.filter_by(user_id=user_id).all()
    strategy_ids = [strategy.id for strategy in strategies]
    
    # Get backtests for these strategies
    backtests = Backtest.query.filter(Backtest.strategy_id.in_(strategy_ids)) \
                          .order_by(Backtest.created_at.desc()).all()
    
    return jsonify({
        "backtests": [backtest.to_dict() for backtest in backtests]
    }), 200

@backtest_bp.route('/<int:backtest_id>', methods=['GET'])
@jwt_required()
def get_backtest(backtest_id):
    user_id = get_jwt_identity()
    
    # Get backtest
    backtest = Backtest.query.get(backtest_id)
    
    if not backtest:
        return jsonify({"error": "Backtest not found"}), 404
    
    # Verify ownership through strategy
    strategy = Strategy.query.get(backtest.strategy_id)
    
    if not strategy or strategy.user_id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403
    
    return jsonify({
        "backtest": backtest.to_dict(),
        "strategy": strategy.to_dict(),
        "trades_data": backtest.trades_data,
        "equity_curve": backtest.equity_curve
    }), 200

@backtest_bp.route('/', methods=['POST'])
@jwt_required()
def run_backtest():
    user_id = get_jwt_identity()
    data = request.json
    
    # Validate required fields
    if not all(k in data for k in ('strategy_id', 'start_date', 'end_date', 'initial_capital', 'name')):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Verify strategy ownership
    strategy = Strategy.query.filter_by(id=data['strategy_id'], user_id=user_id).first()
    
    if not strategy:
        return jsonify({"error": "Strategy not found"}), 404
    
    try:
        # Parse dates
        start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        
        # Basic validation
        if start_date >= end_date:
            return jsonify({"error": "End date must be after start date"}), 400
            
        initial_capital = float(data['initial_capital'])
        
        if initial_capital <= 0:
            return jsonify({"error": "Initial capital must be positive"}), 400
        
        # Get parameters for strategy
        parameters = strategy.parameters
        indicators = strategy.indicators
        symbol = parameters.get('symbol', 'SPY')  # Default to SPY if not specified
        
        # Fetch historical data
        ticker = yf.Ticker(symbol)
        history = ticker.history(start=start_date, end=end_date)
        
        if history.empty:
            return jsonify({"error": "No historical data available for the specified period"}), 400
        
        # Run a simple moving average crossover strategy (this is just an example)
        # In production, this would use the actual strategy logic from the strategy parameters
        
        # Calculate indicators
        short_period = parameters.get('short_ma', 20)
        long_period = parameters.get('long_ma', 50)
        
        history['short_ma'] = history['Close'].rolling(window=short_period).mean()
        history['long_ma'] = history['Close'].rolling(window=long_period).mean()
        
        # Generate signals
        history['signal'] = 0
        history.loc[history['short_ma'] > history['long_ma'], 'signal'] = 1
        history.loc[history['short_ma'] < history['long_ma'], 'signal'] = -1
        
        # Calculate returns
        history['returns'] = history['Close'].pct_change()
        history['strategy_returns'] = history['signal'].shift(1) * history['returns']
        
        # Calculate equity curve
        history['equity_curve'] = (1 + history['strategy_returns']).cumprod() * initial_capital
        history['benchmark_equity'] = (1 + history['returns']).cumprod() * initial_capital
        
        # Generate trades
        trades = []
        current_position = 0
        
        for i in range(1, len(history)):
            if history['signal'].iloc[i] != history['signal'].iloc[i-1]:
                # Signal changed, generate a trade
                if history['signal'].iloc[i] == 1:  # Buy signal
                    price = history['Close'].iloc[i]
                    shares = initial_capital / price
                    trades.append({
                        'date': history.index[i].strftime('%Y-%m-%d'),
                        'type': 'buy',
                        'price': price,
                        'shares': shares,
                        'value': price * shares
                    })
                    current_position = shares
                elif history['signal'].iloc[i] == -1 and current_position > 0:  # Sell signal
                    price = history['Close'].iloc[i]
                    trades.append({
                        'date': history.index[i].strftime('%Y-%m-%d'),
                        'type': 'sell',
                        'price': price,
                        'shares': current_position,
                        'value': price * current_position
                    })
                    current_position = 0
        
        # Calculate performance metrics
        final_capital = history['equity_curve'].iloc[-1]
        profit_loss = final_capital - initial_capital
        profit_loss_percent = (profit_loss / initial_capital) * 100
        
        # Calculate max drawdown
        peak = history['equity_curve'].expanding(min_periods=1).max()
        drawdown = (history['equity_curve'] - peak) / peak
        max_drawdown = drawdown.min() * 100
        
        # Calculate Sharpe ratio (annualized)
        risk_free_rate = 0.02  # Assume 2% risk-free rate
        returns = history['strategy_returns'].dropna()
        sharpe_ratio = ((returns.mean() * 252) - risk_free_rate) / (returns.std() * np.sqrt(252))
        
        # Prepare equity curve data for JSON
        equity_data = []
        for date, value in zip(history.index, history['equity_curve']):
            equity_data.append({
                'date': date.strftime('%Y-%m-%d'),
                'value': float(value)
            })
        
        # Create backtest record
        backtest = Backtest(
            name=data['name'],
            start_date=start_date,
            end_date=end_date,
            initial_capital=initial_capital,
            final_capital=final_capital,
            profit_loss=profit_loss,
            profit_loss_percent=profit_loss_percent,
            max_drawdown=max_drawdown,
            sharpe_ratio=sharpe_ratio,
            trades_data=trades,
            equity_curve=equity_data,
            strategy_id=strategy.id
        )
        
        db.session.add(backtest)
        db.session.commit()
        
        return jsonify({
            "message": "Backtest completed successfully",
            "backtest": backtest.to_dict(),
            "summary": {
                "initial_capital": initial_capital,
                "final_capital": final_capital,
                "profit_loss": profit_loss,
                "profit_loss_percent": profit_loss_percent,
                "max_drawdown": max_drawdown,
                "sharpe_ratio": sharpe_ratio,
                "total_trades": len(trades)
            }
        }), 201
        
    except Exception as e:
        return jsonify({"error": f"Backtest failed: {str(e)}"}), 500
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta

market_bp = Blueprint('market', __name__)

@market_bp.route('/quote/<symbol>', methods=['GET'])
@jwt_required()
def get_quote(symbol):
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        
        # Extract relevant information
        quote_data = {
            'symbol': symbol,
            'price': info.get('currentPrice', info.get('regularMarketPrice', 0)),
            'change': info.get('regularMarketChange', 0),
            'change_percent': info.get('regularMarketChangePercent', 0),
            'high': info.get('dayHigh', 0),
            'low': info.get('dayLow', 0),
            'open': info.get('open', 0),
            'previous_close': info.get('previousClose', 0),
            'volume': info.get('volume', 0),
            'market_cap': info.get('marketCap', 0),
            'name': info.get('shortName', symbol)
        }
        
        return jsonify(quote_data), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch quote: {str(e)}"}), 500

@market_bp.route('/history/<symbol>', methods=['GET'])
@jwt_required()
def get_history(symbol):
    try:
        # Get query parameters
        period = request.args.get('period', '1mo')
        interval = request.args.get('interval', '1d')
        
        # Validate parameters
        valid_periods = ['1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', 'max']
        valid_intervals = ['1m', '2m', '5m', '15m', '30m', '60m', '90m', '1h', '1d', '5d', '1wk', '1mo', '3mo']
        
        if period not in valid_periods:
            return jsonify({"error": f"Invalid period. Valid options are: {', '.join(valid_periods)}"}), 400
            
        if interval not in valid_intervals:
            return jsonify({"error": f"Invalid interval. Valid options are: {', '.join(valid_intervals)}"}), 400
        
        # Fetch data
        ticker = yf.Ticker(symbol)
        history = ticker.history(period=period, interval=interval)
        
        # Process data for charting
        data = []
        for date, row in history.iterrows():
            data.append({
                'time': date.timestamp(),
                'open': row['Open'],
                'high': row['High'],
                'low': row['Low'],
                'close': row['Close'],
                'volume': row['Volume']
            })
        
        return jsonify({
            'symbol': symbol,
            'period': period,
            'interval': interval,
            'data': data
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to fetch history: {str(e)}"}), 500

@market_bp.route('/search', methods=['GET'])
@jwt_required()
def search_symbols():
    try:
        query = request.args.get('query', '')
        
        if not query or len(query) < 2:
            return jsonify({"error": "Query must be at least 2 characters"}), 400
        
        # This is a simplified approach - in production, you would use a more comprehensive market data API
        # or maintain your own database of symbols
        tickers = yf.Tickers([
            'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 
            'V', 'PG', 'UNH', 'HD', 'BAC', 'XOM', 'DIS', 'NFLX', 'ADBE', 'CRM'
        ])
        
        results = []
        for ticker in tickers.tickers:
            symbol = ticker.ticker
            try:
                info = ticker.info
                name = info.get('shortName', '')
                
                if query.upper() in symbol or query.lower() in name.lower():
                    results.append({
                        'symbol': symbol,
                        'name': name,
                        'exchange': info.get('exchange', ''),
                        'type': info.get('quoteType', '')
                    })
            except:
                # Skip tickers that fail to fetch info
                pass
        
        return jsonify(results), 200
    except Exception as e:
        return jsonify({"error": f"Search failed: {str(e)}"}), 500
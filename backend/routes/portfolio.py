from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.db import db
from models.portfolio import Portfolio, Position, Trade
from models.user import User
import yfinance as yf

portfolio_bp = Blueprint('portfolio', __name__)

@portfolio_bp.route('/', methods=['GET'])
@jwt_required()
def get_portfolio():
    user_id = get_jwt_identity()
    
    portfolio = Portfolio.query.filter_by(user_id=user_id).first()
    
    if not portfolio:
        return jsonify({"error": "Portfolio not found"}), 404
    
    # Get positions with updated prices
    positions = Position.query.filter_by(portfolio_id=portfolio.id).all()
    positions_data = []
    
    for position in positions:
        # Update current price (in production, this would use a more efficient batch approach)
        try:
            ticker = yf.Ticker(position.symbol)
            current_price = ticker.info.get('currentPrice', position.current_price)
            position.current_price = current_price
            db.session.commit()
        except:
            # If price update fails, use existing price
            pass
        
        positions_data.append(position.to_dict())
    
    # Get recent trades
    trades = Trade.query.filter_by(portfolio_id=portfolio.id).order_by(Trade.executed_at.desc()).limit(10).all()
    trades_data = [trade.to_dict() for trade in trades]
    
    return jsonify({
        "portfolio": portfolio.to_dict(),
        "positions": positions_data,
        "recent_trades": trades_data
    }), 200

@portfolio_bp.route('/positions', methods=['GET'])
@jwt_required()
def get_positions():
    user_id = get_jwt_identity()
    
    portfolio = Portfolio.query.filter_by(user_id=user_id).first()
    
    if not portfolio:
        return jsonify({"error": "Portfolio not found"}), 404
    
    positions = Position.query.filter_by(portfolio_id=portfolio.id).all()
    
    return jsonify({
        "positions": [position.to_dict() for position in positions]
    }), 200

@portfolio_bp.route('/trades', methods=['GET'])
@jwt_required()
def get_trades():
    user_id = get_jwt_identity()
    
    portfolio = Portfolio.query.filter_by(user_id=user_id).first()
    
    if not portfolio:
        return jsonify({"error": "Portfolio not found"}), 404
    
    # Pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    
    trades = Trade.query.filter_by(portfolio_id=portfolio.id) \
                      .order_by(Trade.executed_at.desc()) \
                      .paginate(page=page, per_page=per_page)
    
    return jsonify({
        "trades": [trade.to_dict() for trade in trades.items],
        "total": trades.total,
        "pages": trades.pages,
        "page": page
    }), 200

@portfolio_bp.route('/trade', methods=['POST'])
@jwt_required()
def execute_trade():
    user_id = get_jwt_identity()
    data = request.json
    
    # Validate required fields
    if not all(k in data for k in ('symbol', 'quantity', 'direction')):
        return jsonify({"error": "Missing required fields"}), 400
    
    portfolio = Portfolio.query.filter_by(user_id=user_id).first()
    
    if not portfolio:
        return jsonify({"error": "Portfolio not found"}), 404
    
    symbol = data['symbol']
    quantity = float(data['quantity'])
    direction = data['direction'].lower()
    
    # Validate direction
    if direction not in ['buy', 'sell']:
        return jsonify({"error": "Direction must be 'buy' or 'sell'"}), 400
    
    # Get current price
    try:
        ticker = yf.Ticker(symbol)
        price = ticker.info.get('currentPrice', ticker.info.get('regularMarketPrice'))
        
        if not price:
            return jsonify({"error": "Could not get current price for symbol"}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to fetch market data: {str(e)}"}), 500
    
    # Check if selling existing position
    if direction == 'sell':
        position = Position.query.filter_by(portfolio_id=portfolio.id, symbol=symbol).first()
        
        if not position or position.quantity < quantity:
            return jsonify({"error": "Insufficient shares to sell"}), 400
    
    # Check if buying with sufficient funds
    if direction == 'buy':
        total_cost = price * quantity
        
        if portfolio.current_balance < total_cost:
            return jsonify({"error": "Insufficient funds"}), 400
    
    # Execute trade
    trade = Trade(
        symbol=symbol,
        quantity=quantity,
        price=price,
        direction=direction,
        portfolio_id=portfolio.id,
        strategy_id=data.get('strategy_id')
    )
    
    # Update portfolio balance
    if direction == 'buy':
        portfolio.current_balance -= price * quantity
    else:
        portfolio.current_balance += price * quantity
    
    # Update or create position
    position = Position.query.filter_by(portfolio_id=portfolio.id, symbol=symbol).first()
    
    if position:
        if direction == 'buy':
            # Update average entry price
            new_total = (position.quantity * position.entry_price) + (quantity * price)
            position.quantity += quantity
            position.entry_price = new_total / position.quantity
            position.current_price = price
        else:
            position.quantity -= quantity
            position.current_price = price
            
            # Remove position if quantity is zero
            if position.quantity <= 0:
                db.session.delete(position)
    else:
        if direction == 'buy':
            position = Position(
                symbol=symbol,
                quantity=quantity,
                entry_price=price,
                current_price=price,
                portfolio_id=portfolio.id
            )
            db.session.add(position)
    
    db.session.add(trade)
    db.session.commit()
    
    return jsonify({
        "message": "Trade executed successfully",
        "trade": trade.to_dict(),
        "portfolio": portfolio.to_dict()
    }), 201
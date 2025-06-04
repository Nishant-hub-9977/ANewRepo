from datetime import datetime
from models.db import db

class Portfolio(db.Model):
    __tablename__ = 'portfolios'
    
    id = db.Column(db.Integer, primary_key=True)
    initial_balance = db.Column(db.Float, nullable=False)
    current_balance = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    
    # Relationships
    positions = db.relationship('Position', backref='portfolio', lazy='dynamic')
    trades = db.relationship('Trade', backref='portfolio', lazy='dynamic')
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'initial_balance': self.initial_balance,
            'current_balance': self.current_balance,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'user_id': self.user_id
        }


class Position(db.Model):
    __tablename__ = 'positions'
    
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(20), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    entry_price = db.Column(db.Float, nullable=False)
    current_price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolios.id'), nullable=False)
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'symbol': self.symbol,
            'quantity': self.quantity,
            'entry_price': self.entry_price,
            'current_price': self.current_price,
            'market_value': self.quantity * self.current_price,
            'profit_loss': (self.current_price - self.entry_price) * self.quantity,
            'profit_loss_percent': ((self.current_price - self.entry_price) / self.entry_price) * 100,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'portfolio_id': self.portfolio_id
        }


class Trade(db.Model):
    __tablename__ = 'trades'
    
    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(20), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    direction = db.Column(db.String(4), nullable=False)  # "buy" or "sell"
    executed_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign keys
    portfolio_id = db.Column(db.Integer, db.ForeignKey('portfolios.id'), nullable=False)
    strategy_id = db.Column(db.Integer, db.ForeignKey('strategies.id'), nullable=True)
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'symbol': self.symbol,
            'quantity': self.quantity,
            'price': self.price,
            'direction': self.direction,
            'total_value': self.quantity * self.price,
            'executed_at': self.executed_at.isoformat(),
            'portfolio_id': self.portfolio_id,
            'strategy_id': self.strategy_id
        }

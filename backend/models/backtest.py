from datetime import datetime
from models.db import db

class Backtest(db.Model):
    __tablename__ = 'backtests'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    initial_capital = db.Column(db.Float, nullable=False)
    final_capital = db.Column(db.Float, nullable=False)
    profit_loss = db.Column(db.Float, nullable=False)
    profit_loss_percent = db.Column(db.Float, nullable=False)
    max_drawdown = db.Column(db.Float, nullable=False)
    sharpe_ratio = db.Column(db.Float, nullable=True)
    trades_data = db.Column(db.JSON, nullable=False, default={})
    equity_curve = db.Column(db.JSON, nullable=False, default={})
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Foreign keys
    strategy_id = db.Column(db.Integer, db.ForeignKey('strategies.id'), nullable=False)
    
    def to_dict(self):
        """Convert to dictionary for API responses"""
        return {
            'id': self.id,
            'name': self.name,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'initial_capital': self.initial_capital,
            'final_capital': self.final_capital,
            'profit_loss': self.profit_loss,
            'profit_loss_percent': self.profit_loss_percent,
            'max_drawdown': self.max_drawdown,
            'sharpe_ratio': self.sharpe_ratio,
            'created_at': self.created_at.isoformat(),
            'strategy_id': self.strategy_id
        }

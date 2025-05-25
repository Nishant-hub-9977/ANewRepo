from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

from routes.auth import auth_bp
from routes.market import market_bp
from routes.strategy import strategy_bp
from routes.portfolio import portfolio_bp
from routes.backtest import backtest_bp
from models.db import db

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///algotrading.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret-key')

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(market_bp, url_prefix='/api/market')
app.register_blueprint(strategy_bp, url_prefix='/api/strategy')
app.register_blueprint(portfolio_bp, url_prefix='/api/portfolio')
app.register_blueprint(backtest_bp, url_prefix='/api/backtest')

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy"})

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)
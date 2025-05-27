from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Route Blueprints
from routes.auth import auth_bp
from routes.market import market_bp
from routes.strategy import strategy_bp
from routes.portfolio import portfolio_bp
from routes.backtest import backtest_bp
from routes.secure import secure_bp  # ✅ Firebase protected route

# Database
from models.db import db

# 1. Load environment variables from your .env
load_dotenv()

app = Flask(__name__)

# 2. Configure CORS
origins = os.getenv(
    "CORS_ORIGINS",
    "https://anewrepo.onrender.com,https://mystocktrading-ui.netlify.app"
)
allowed_origins = [url.strip() for url in origins.split(",")]
CORS(app, origins=allowed_origins)

# 3. App configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI", "sqlite:///algotrading.db")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-key")

# 4. Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# 5. Register your blueprints
app.register_blueprint(auth_bp,      url_prefix="/api/auth")
app.register_blueprint(market_bp,    url_prefix="/api/market")
app.register_blueprint(strategy_bp,  url_prefix="/api/strategy")
app.register_blueprint(portfolio_bp, url_prefix="/api/portfolio")
app.register_blueprint(backtest_bp,  url_prefix="/api/backtest")
app.register_blueprint(secure_bp,    url_prefix="/api")  # ✅ Firebase Auth-protected

# 6. A simple health check
@app.route("/api/health")
def health_check():
    return jsonify({"status": "healthy"})

# 7. Ensure all tables exist
with app.app_context():
    db.create_all()

# 8. Only run Flask’s built-in server in local dev
if __name__ == "__main__":
    app.run(debug=True)

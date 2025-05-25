from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models.db import db
from models.user import User
from models.portfolio import Portfolio

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    
    # Validate required fields
    if not all(k in data for k in ('username', 'email', 'password')):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if user already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already taken"}), 409
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 409
    
    # Create new user
    user = User(username=data['username'], email=data['email'])
    user.set_password(data['password'])
    
    # Create portfolio with initial balance
    initial_balance = data.get('initial_balance', 10000.0)
    portfolio = Portfolio(initial_balance=initial_balance, current_balance=initial_balance)
    
    # Add to database
    db.session.add(user)
    db.session.flush()  # Flush to get user.id
    
    portfolio.user_id = user.id
    db.session.add(portfolio)
    db.session.commit()
    
    # Generate access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        "message": "User registered successfully",
        "user": user.to_dict(),
        "access_token": access_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # Validate required fields
    if not all(k in data for k in ('username', 'password')):
        return jsonify({"error": "Missing username or password"}), 400
    
    # Find user
    user = User.query.filter_by(username=data['username']).first()
    
    # Verify user and password
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid username or password"}), 401
    
    # Generate access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        "message": "Login successful",
        "user": user.to_dict(),
        "access_token": access_token
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"user": user.to_dict()}), 200
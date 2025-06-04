from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.db import db
from models.strategy import Strategy
from models.user import User

strategy_bp = Blueprint('strategy', __name__)

@strategy_bp.route('/', methods=['GET'])
@jwt_required()
def get_strategies():
    user_id = get_jwt_identity()
    
    strategies = Strategy.query.filter_by(user_id=user_id).all()
    return jsonify({
        "strategies": [strategy.to_dict() for strategy in strategies]
    }), 200

@strategy_bp.route('/<int:strategy_id>', methods=['GET'])
@jwt_required()
def get_strategy(strategy_id):
    user_id = get_jwt_identity()
    
    strategy = Strategy.query.filter_by(id=strategy_id, user_id=user_id).first()
    
    if not strategy:
        return jsonify({"error": "Strategy not found"}), 404
    
    return jsonify({"strategy": strategy.to_dict()}), 200

@strategy_bp.route('/', methods=['POST'])
@jwt_required()
def create_strategy():
    user_id = get_jwt_identity()
    data = request.json
    
    # Validate required fields
    if not all(k in data for k in ('name', 'parameters')):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Create new strategy
    strategy = Strategy(
        name=data['name'],
        description=data.get('description', ''),
        parameters=data['parameters'],
        indicators=data.get('indicators', {}),
        is_active=data.get('is_active', False),
        user_id=user_id
    )
    
    db.session.add(strategy)
    db.session.commit()
    
    return jsonify({
        "message": "Strategy created successfully",
        "strategy": strategy.to_dict()
    }), 201

@strategy_bp.route('/<int:strategy_id>', methods=['PUT'])
@jwt_required()
def update_strategy(strategy_id):
    user_id = get_jwt_identity()
    data = request.json
    
    strategy = Strategy.query.filter_by(id=strategy_id, user_id=user_id).first()
    
    if not strategy:
        return jsonify({"error": "Strategy not found"}), 404
    
    # Update fields
    if 'name' in data:
        strategy.name = data['name']
    if 'description' in data:
        strategy.description = data['description']
    if 'parameters' in data:
        strategy.parameters = data['parameters']
    if 'indicators' in data:
        strategy.indicators = data['indicators']
    if 'is_active' in data:
        strategy.is_active = data['is_active']
    
    db.session.commit()
    
    return jsonify({
        "message": "Strategy updated successfully",
        "strategy": strategy.to_dict()
    }), 200

@strategy_bp.route('/<int:strategy_id>', methods=['DELETE'])
@jwt_required()
def delete_strategy(strategy_id):
    user_id = get_jwt_identity()
    
    strategy = Strategy.query.filter_by(id=strategy_id, user_id=user_id).first()
    
    if not strategy:
        return jsonify({"error": "Strategy not found"}), 404
    
    db.session.delete(strategy)
    db.session.commit()
    
    return jsonify({
        "message": "Strategy deleted successfully"
    }), 200

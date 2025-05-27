from flask import Blueprint, request, jsonify
from firebase_admin import auth as firebase_auth
from firebase_init import *  # ✅ Ensures Firebase is initialized from same directory

secure_bp = Blueprint('secure', __name__)

@secure_bp.route('/protected', methods=['GET'])
def protected():
    try:
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return jsonify({"error": "Unauthorized - No Bearer token"}), 401

        id_token = auth_header.split(' ')[1]
        decoded_token = firebase_auth.verify_id_token(id_token)
        uid = decoded_token.get('uid')

        return jsonify({"message": "Authenticated successfully", "uid": uid}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 401

import os
import json
import firebase_admin
from firebase_admin import credentials

# Load service account from environment variable
service_account_env = os.environ.get('FIREBASE_SERVICE_ACCOUNT')

if not service_account_env:
    raise ValueError("Missing FIREBASE_SERVICE_ACCOUNT in environment variables")

try:
    # Parse the JSON string from the env variable
    service_account_dict = json.loads(service_account_env)
except json.JSONDecodeError as e:
    raise ValueError("Invalid JSON in FIREBASE_SERVICE_ACCOUNT environment variable.") from e

# Create credentials and initialize Firebase only once
cred = credentials.Certificate(service_account_dict)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

import os
import json
import firebase_admin
from firebase_admin import credentials

# Load service account from Render secret environment variable
service_account_json = os.environ.get('FIREBASE_SERVICE_ACCOUNT')
if not service_account_json:
    raise ValueError("Missing FIREBASE_SERVICE_ACCOUNT in environment variables.")

cred = credentials.Certificate(json.loads(service_account_json))

# Initialize only once
if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/cybershield")

client = MongoClient(MONGO_URI)
db = client.cybershield

def get_db():
    return db

def init_db():
    db.users.create_index("email", unique=True)
    db.logs.create_index("timestamp")
    db.threats.create_index("created_at")

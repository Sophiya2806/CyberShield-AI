import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import LabelEncoder
from datetime import datetime, timedelta
from typing import Dict, Any, List
import joblib
import os

MODEL_PATH = "models/threat_model.pkl"

class ThreatDetector:
    def __init__(self):
        self.model = None
        self.label_encoders = {}
        self._init_model()
    
    def _init_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                self.model = joblib.load(MODEL_PATH)
            except:
                self._train_model()
        else:
            self._train_model()
    
    def _generate_sample_data(self) -> pd.DataFrame:
        data = []
        
        for i in range(100):
            data.append({
                "ip": f"192.168.{i%255}.10",
                "failed_attempts": 0,
                "success_attempts": 1,
                "request_rate": 1,
                "hour": 9 + i%8,
                "is_threat": 0
            })
        
        for i in range(50):
            data.append({
                "ip": f"10.0.{i%255}.{20+i}",
                "failed_attempts": 20 + i*2,
                "success_attempts": 0,
                "request_rate": 50 + i*3,
                "hour": 0 + i%24,
                "is_threat": 1
            })
        
        return pd.DataFrame(data)
    
    def _train_model(self):
        df = self._generate_sample_data()
        X = df[["failed_attempts", "success_attempts", "request_rate", "hour"]]
        y = df["is_threat"]
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        
        os.makedirs("models", exist_ok=True)
        joblib.dump(self.model, MODEL_PATH)
    
    def extract_features(self, logs: List[Dict[str, Any]]) -> Dict[str, Any]:
        ip_attempts = {}
        for log in logs:
            ip = log.get("ip", "0.0.0.0")
            if ip not in ip_attempts:
                ip_attempts[ip] = {"failed": 0, "success": 0, "count": 0}
            
            if log.get("event_type") == "login_failure":
                ip_attempts[ip]["failed"] += 1
            elif log.get("event_type") == "login_success":
                ip_attempts[ip]["success"] += 1
            ip_attempts[ip]["count"] += 1
        
        return ip_attempts
    
    def predict(self, logs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        ip_features = self.extract_features(logs)
        results = []
        
        for ip, features in ip_features.items():
            X = np.array([[
                features["failed"],
                features["success"],
                features["count"],
                datetime.now().hour
            ]])
            
            prediction = self.model.predict(X)[0]
            probability = self.model.predict_proba(X)[0]
            
            is_threat = bool(prediction == 1)
            confidence = float(max(probability) * 100)
            
            attack_type = "Normal Activity"
            threat_level = "LOW"
            
            if is_threat:
                if features["failed"] > 10:
                    attack_type = "Brute Force Attack"
                    threat_level = "HIGH"
                elif features["count"] > 50:
                    attack_type = "Abnormal Traffic Spike"
                    threat_level = "MEDIUM"
                else:
                    attack_type = "Suspicious IP Activity"
                    threat_level = "MEDIUM"
            
            results.append({
                "ip": ip,
                "is_threat": is_threat,
                "threat_level": threat_level,
                "attack_type": attack_type,
                "confidence": confidence
            })
        
        return results

detector = ThreatDetector()

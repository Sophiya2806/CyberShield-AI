from typing import Dict, Any, List
from datetime import datetime

class RulesEngine:
    @staticmethod
    def check_rules(logs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        rules_results = []
        ip_stats = {}
        
        for log in logs:
            ip = log.get("ip", "0.0.0.0")
            if ip not in ip_stats:
                ip_stats[ip] = {
                    "failed_attempts": 0,
                    "total_requests": 0,
                    "events": []
                }
            
            ip_stats[ip]["total_requests"] += 1
            if log.get("event_type") == "login_failure":
                ip_stats[ip]["failed_attempts"] += 1
            ip_stats[ip]["events"].append(log)
        
        for ip, stats in ip_stats.items():
            if stats["failed_attempts"] >= 5:
                rules_results.append({
                    "ip": ip,
                    "rule": "brute_force",
                    "severity": "HIGH",
                    "details": f"{stats['failed_attempts']} failed login attempts detected"
                })
            
            if stats["total_requests"] >= 30:
                rules_results.append({
                    "ip": ip,
                    "rule": "traffic_spike",
                    "severity": "MEDIUM",
                    "details": f"Abnormal traffic: {stats['total_requests']} requests"
                })
        
        return rules_results

from typing import Dict, Any, List

class AIExplanationEngine:
    @staticmethod
    def generate_explanation(threat_data: Dict[str, Any]) -> Dict[str, Any]:
        attack_type = threat_data.get("attack_type", "Unknown")
        ip = threat_data.get("ip", "Unknown")
        
        explanations = {
            "Brute Force Attack": {
                "summary": "Multiple failed login attempts detected from a single IP address.",
                "reason": f"IP {ip} has attempted multiple logins with failed credentials, indicating a potential credential stuffing attack.",
                "impact": "Unauthorized access attempt that could compromise user accounts if successful.",
                "recommendations": [
                    "Block the IP address temporarily",
                    "Enable account lockout policies",
                    "Implement multi-factor authentication",
                    "Review authentication logs for affected accounts"
                ]
            },
            "Abnormal Traffic Spike": {
                "summary": "Unusual request rate detected from an IP address.",
                "reason": f"IP {ip} is generating an abnormally high number of requests, which may indicate a DoS attack or scanning activity.",
                "impact": "Potential service disruption or reconnaissance activity.",
                "recommendations": [
                    "Implement rate limiting",
                    "Monitor the IP for further suspicious activity",
                    "Consider blocking if behavior continues"
                ]
            },
            "Suspicious IP Activity": {
                "summary": "Unusual behavior detected from an IP address.",
                "reason": f"IP {ip} is showing behavior patterns outside of normal baseline activity.",
                "impact": "Potential reconnaissance or early stages of an attack.",
                "recommendations": [
                    "Monitor the IP closely",
                    "Review access patterns",
                    "Implement additional logging"
                ]
            },
            "Normal Activity": {
                "summary": "No suspicious activity detected.",
                "reason": "All observed behavior falls within normal baseline patterns.",
                "impact": "No immediate security concerns.",
                "recommendations": [
                    "Continue regular monitoring",
                    "Update security patches",
                    "Review access controls periodically"
                ]
            }
        }
        
        return explanations.get(attack_type, explanations["Normal Activity"])

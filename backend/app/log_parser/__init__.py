import re
from datetime import datetime
from typing import Dict, Any, List
from app.models import LogEntry

class LogParser:
    @staticmethod
    def parse_log(log_line: str) -> Dict[str, Any]:
        log_line = log_line.strip()
        if not log_line:
            return None
        
        ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
        ip_match = re.search(ip_pattern, log_line)
        ip = ip_match.group(0) if ip_match else "0.0.0.0"
        
        event_type = "unknown"
        source = "general"
        username = None
        
        if "login" in log_line.lower():
            if "failed" in log_line.lower() or "failure" in log_line.lower():
                event_type = "login_failure"
            elif "success" in log_line.lower() or "successful" in log_line.lower():
                event_type = "login_success"
        
        if "apache" in log_line.lower():
            source = "Apache"
        elif "windows" in log_line.lower():
            source = "Windows"
        elif "firewall" in log_line.lower():
            source = "Firewall"
        
        username_match = re.search(r'user\s+(\w+)', log_line, re.IGNORECASE)
        if username_match:
            username = username_match.group(1)
        
        return {
            "ip": ip,
            "timestamp": datetime.now().isoformat(),
            "event_type": event_type,
            "source": source,
            "message": log_line,
            "username": username
        }
    
    @staticmethod
    def parse_multiple_logs(logs: str) -> List[Dict[str, Any]]:
        parsed = []
        lines = logs.split('\n')
        for line in lines:
            if line.strip():
                parsed_log = LogParser.parse_log(line)
                if parsed_log:
                    parsed.append(parsed_log)
        return parsed

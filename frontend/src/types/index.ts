export interface User {
  name: string;
  email: string;
}

export interface LogEntry {
  ip: string;
  timestamp: string;
  event_type: string;
  source: string;
  message: string;
  username?: string;
}

export interface Threat {
  ip: string;
  is_threat: boolean;
  threat_level: 'LOW' | 'MEDIUM' | 'HIGH';
  attack_type: string;
  confidence: number;
  summary: string;
  reason: string;
  impact: string;
  recommendations: string[];
  detected_at: string;
}

export interface Stats {
  total_logs: number;
  total_threats: number;
  critical_alerts: number;
  security_score: number;
  attack_types: Record<string, number>;
}

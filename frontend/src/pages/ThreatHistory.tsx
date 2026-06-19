import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { threatsAPI } from '../services/api';
import { Threat } from '../types';

const ThreatHistory: React.FC = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchThreats = async () => {
    try {
      const response = await threatsAPI.getThreats();
      setThreats(response.data.threats || []);
    } catch (err) {
      console.error('Error fetching threats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreats();
  }, []);

  const getSeverityColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'MEDIUM':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default:
        return 'text-green-400 bg-green-500/20 border-green-500/30';
    }
  };

  return (
    <div className="flex min-h-screen bg-cyber-bg">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Threat History</h1>
          <p className="text-gray-400">View all detected security threats</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-4xl animate-pulse mb-4">🔍</div>
              <p className="text-gray-400">Loading threats...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {threats.map((threat, index) => (
              <div
                key={index}
                className={`bg-gray-900 rounded-xl p-6 border ${getSeverityColor(threat.threat_level)}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          threat.threat_level === 'HIGH'
                            ? 'bg-red-500 text-white'
                            : threat.threat_level === 'MEDIUM'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-green-500 text-white'
                        }`}
                      >
                        {threat.threat_level}
                      </span>
                      <h3 className="text-xl font-bold text-white">{threat.attack_type}</h3>
                      <span className="text-gray-400 font-mono">IP: {threat.ip}</span>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Detected: {new Date(threat.detected_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-cyber-primary">{threat.confidence.toFixed(0)}%</div>
                    <div className="text-xs text-gray-400">Confidence</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">📋 Summary</h4>
                    <p className="text-gray-300">{threat.summary}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">🔍 Reason</h4>
                    <p className="text-gray-300">{threat.reason}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">⚠️ Impact</h4>
                    <p className="text-gray-300">{threat.impact}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">💡 Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {threat.recommendations.map((rec, i) => (
                        <li key={i} className="text-gray-300">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            {threats.length === 0 && (
              <div className="bg-gray-900 rounded-xl p-12 border border-gray-800 text-center">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-white mb-2">No Threats Found</h3>
                <p className="text-gray-400">Great job! No security threats have been detected yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatHistory;

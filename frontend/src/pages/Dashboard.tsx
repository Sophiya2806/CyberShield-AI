import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { threatsAPI, analyzeAPI, logsAPI } from '../services/api';
import { Stats, Threat } from '../types';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchData = async () => {
    try {
      const [statsRes, threatsRes] = await Promise.all([
        threatsAPI.getStats(),
        threatsAPI.getThreats()
      ]);
      setStats(statsRes.data);
      setThreats(threatsRes.data.threats || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      await analyzeAPI.quickAnalyze();
      await fetchData();
    } catch (err) {
      console.error('Error running analysis:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const generateSampleData = async () => {
    try {
      await logsAPI.generateSample();
      await fetchData();
    } catch (err) {
      console.error('Error generating sample data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const attackTypeData = {
    labels: stats ? Object.keys(stats.attack_types) : [],
    datasets: [
      {
        data: stats ? Object.values(stats.attack_types) : [],
        backgroundColor: ['#22C55E', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'],
        borderWidth: 0,
      },
    ],
  };

  const threatTimelineData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Threats',
        data: [2, 5, 3, 8, 4, 6, 3],
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cyber-bg">
        <div className="text-center">
          <div className="text-4xl animate-pulse mb-4">🔍</div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-cyber-bg">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
            <p className="text-gray-400">Monitor and analyze threats in real-time</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={generateSampleData}
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              📊 Generate Sample Data
            </button>
            <button
              onClick={runAnalysis}
              disabled={analyzing}
              className="px-6 py-3 bg-cyber-primary hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {analyzing ? '🔄 Analyzing...' : '▶️ Run Analysis'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <span className="text-sm text-gray-400">Total Logs</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.total_logs || 0}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-lg">
                <span className="text-2xl">⚠️</span>
              </div>
              <span className="text-sm text-gray-400">Threats Detected</span>
            </div>
            <p className="text-3xl font-bold text-yellow-400">{stats?.total_threats || 0}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <span className="text-2xl">🚨</span>
              </div>
              <span className="text-sm text-gray-400">Critical Alerts</span>
            </div>
            <p className="text-3xl font-bold text-red-400">{stats?.critical_alerts || 0}</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <span className="text-2xl">🛡️</span>
              </div>
              <span className="text-sm text-gray-400">Security Score</span>
            </div>
            <p className="text-3xl font-bold text-cyber-primary">{stats?.security_score || 100}/100</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Threat Timeline</h3>
            <div className="h-64">
              <Line data={threatTimelineData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-4">Attack Type Distribution</h3>
            <div className="h-64">
              <Doughnut data={attackTypeData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Threats</h3>
          <div className="space-y-4">
            {threats.slice(0, 5).map((threat, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  threat.threat_level === 'HIGH'
                    ? 'bg-red-500/10 border-red-500/30'
                    : threat.threat_level === 'MEDIUM'
                    ? 'bg-yellow-500/10 border-yellow-500/30'
                    : 'bg-green-500/10 border-green-500/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          threat.threat_level === 'HIGH'
                            ? 'bg-red-500 text-white'
                            : threat.threat_level === 'MEDIUM'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-green-500 text-white'
                        }`}
                      >
                        {threat.threat_level}
                      </span>
                      <h4 className="font-semibold text-white">{threat.attack_type}</h4>
                      <span className="text-gray-400 text-sm">IP: {threat.ip}</span>
                    </div>
                    <p className="text-gray-300 text-sm">{threat.summary}</p>
                  </div>
                  <span className="text-cyber-primary font-semibold">{threat.confidence.toFixed(0)}%</span>
                </div>
              </div>
            ))}
            {threats.length === 0 && (
              <p className="text-gray-400 text-center py-8">No threats detected yet. Run an analysis!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { reportsAPI, threatsAPI } from '../services/api';
import { Threat, Stats } from '../types';

const Reports: React.FC = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [downloading, setDownloading] = useState(false);

  const fetchData = async () => {
    try {
      const [threatsRes, statsRes] = await Promise.all([
        threatsAPI.getThreats(),
        threatsAPI.getStats()
      ]);
      setThreats(threatsRes.data.threats || []);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadReport = async () => {
    setDownloading(true);
    try {
      const response = await reportsAPI.downloadReport();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cybershield-report-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading report:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-cyber-bg">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Security Reports</h1>
            <p className="text-gray-400">Generate and download comprehensive security reports</p>
          </div>
          <button
            onClick={downloadReport}
            disabled={downloading}
            className="px-6 py-3 bg-cyber-primary hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {downloading ? '⏳ Generating...' : '📄 Download PDF Report'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4">Report Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyber-blue">{stats?.total_logs || 0}</div>
                <div className="text-sm text-gray-400">Total Logs</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">{stats?.total_threats || 0}</div>
                <div className="text-sm text-gray-400">Threats</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-400">{stats?.critical_alerts || 0}</div>
                <div className="text-sm text-gray-400">Critical</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-cyber-primary">{stats?.security_score || 100}</div>
                <div className="text-sm text-gray-400">Score</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={fetchData}
                className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-left flex items-center gap-3"
              >
                🔄 Refresh Data
              </button>
              <button
                onClick={downloadReport}
                disabled={downloading}
                className="w-full px-4 py-3 bg-cyber-primary/20 hover:bg-cyber-primary/30 text-cyber-primary rounded-lg transition-colors text-left flex items-center gap-3 disabled:opacity-50"
              >
                📥 Export as PDF
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Threat Details</h3>
          {threats.length > 0 ? (
            <div className="space-y-4">
              {threats.map((threat, index) => (
                <div key={index} className="bg-gray-800 rounded-lg p-4 border-l-4 border-cyber-primary">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mr-2 ${
                        threat.threat_level === 'HIGH' ? 'bg-red-500 text-white' :
                        threat.threat_level === 'MEDIUM' ? 'bg-yellow-500 text-black' :
                        'bg-green-500 text-white'
                      }`}>
                        {threat.threat_level}
                      </span>
                      <span className="font-semibold text-white">{threat.attack_type}</span>
                      <span className="text-gray-400 ml-2">IP: {threat.ip}</span>
                    </div>
                    <span className="text-cyber-primary font-bold">{threat.confidence.toFixed(0)}%</span>
                  </div>
                  <p className="text-gray-300 text-sm">{threat.summary}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-4">📄</div>
              <p>No threats to include in the report yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;

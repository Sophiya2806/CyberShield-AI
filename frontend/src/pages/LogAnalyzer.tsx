import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { logsAPI } from '../services/api';
import { LogEntry } from '../types';

const LogAnalyzer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [rawLogs, setRawLogs] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const fetchLogs = async () => {
    try {
      const response = await logsAPI.getLogs();
      setLogs(response.data.logs || []);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleUpload = async () => {
    setLoading(true);
    setMessage('');
    try {
      const response = await logsAPI.upload(file || undefined, rawLogs || undefined);
      setMessage(response.data.message);
      await fetchLogs();
      setRawLogs('');
      setFile(null);
    } catch (err: any) {
      setMessage('Error uploading logs');
    } finally {
      setLoading(false);
    }
  };

  const generateSample = async () => {
    setLoading(true);
    try {
      const response = await logsAPI.generateSample();
      setMessage(response.data.message);
      await fetchLogs();
    } catch (err) {
      setMessage('Error generating sample logs');
    } finally {
      setLoading(false);
    }
  };

  const getEventColor = (eventType: string) => {
    if (eventType.includes('failure') || eventType.includes('deny')) {
      return 'bg-red-500/20 text-red-400';
    }
    return 'bg-green-500/20 text-green-400';
  };

  return (
    <div className="flex min-h-screen bg-cyber-bg">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Log Analyzer</h1>
          <p className="text-gray-400">Upload, paste, or generate security logs for analysis</p>
        </div>

        {message && (
          <div className="bg-cyber-primary/20 border border-cyber-primary/30 text-cyber-primary px-6 py-3 rounded-lg mb-6">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">📄 Upload Log File</h3>
            <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-gray-400 hover:text-cyber-primary transition-colors"
              >
                <div className="text-4xl mb-2">📁</div>
                <p>{file ? file.name : 'Click to select a log file or drag and drop'}</p>
              </label>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">⌨️ Paste Raw Logs</h3>
            <textarea
              value={rawLogs}
              onChange={(e) => setRawLogs(e.target.value)}
              className="w-full h-32 bg-gray-800 border border-gray-700 rounded-lg p-4 text-white font-mono text-sm focus:outline-none focus:border-cyber-primary"
              placeholder="Failed login from 192.168.1.20&#10;Successful login from 10.0.0.5"
            />
          </div>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={handleUpload}
            disabled={loading || (!file && !rawLogs)}
            className="px-6 py-3 bg-cyber-primary hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Process Logs'}
          </button>
          <button
            onClick={generateSample}
            disabled={loading}
            className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            Generate Sample Logs
          </button>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white">Recent Logs ({logs.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">IP Address</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Timestamp</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Event</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Source</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-300">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {logs.slice(0, 20).map((log, index) => (
                  <tr key={index} className="hover:bg-gray-800/50">
                    <td className="px-6 py-4 text-cyber-blue font-mono">{log.ip}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventColor(log.event_type)}`}>
                        {log.event_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{log.source}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {logs.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <div className="text-4xl mb-4">📝</div>
              <p>No logs yet. Upload or generate sample logs!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LogAnalyzer;

import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Metric {
  timestamp: string;
  block_height: number;
  difficulty: number;
  connection_count: number;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://34.31.232.228:3001';

function BlockchainMetricsChart() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/blockchain_metrics`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Metric[] = await response.json();
      console.log("Received data:", data);
      setMetrics(data);
      setError(null);
    } catch (e) {
      console.error("Fetch error:", e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Blockchain Metrics</h2>
      <div className="h-[600px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="block_height" stroke="#8884d8" name="Block Height" />
            <Line yAxisId="right" type="monotone" dataKey="difficulty" stroke="#82ca9d" name="Difficulty" />
            <Line yAxisId="left" type="monotone" dataKey="connection_count" stroke="#ffc658" name="Connection Count" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <button 
        onClick={handleRefresh}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Refresh Data
      </button>
    </div>
  );
}

export default BlockchainMetricsChart;

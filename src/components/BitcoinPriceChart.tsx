import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PriceData {
  timestamp: number;
  price: number;
}

const BitcoinPriceChart: React.FC = () => {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        // Fetch historical data (last 30 days)
        const historicalResponse = await fetch(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30",
        );
        const historicalData = await historicalResponse.json();

        const formattedData = historicalData.prices.map(
          ([timestamp, price]: [number, number]) => ({
            timestamp,
            price,
          }),
        );

        setPriceData(formattedData);

        // Fetch current price
        const currentResponse = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
        );
        const currentData = await currentResponse.json();
        setCurrentPrice(currentData.bitcoin.usd);
      } catch (error) {
        console.error("Error fetching Bitcoin price data:", error);
      }
    };

    fetchPriceData();
    const intervalId = setInterval(fetchPriceData, 60000); // Update every minute

    return () => clearInterval(intervalId);
  }, []);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };
  const formatTooltipDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Bitcoin Price (USD)</h2>
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Price (with last 30 days)</h3>
        <p className="text-3xl font-bold">
          ${currentPrice ? currentPrice.toLocaleString() : "Loading..."}
        </p>
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={formatDate}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis
              domain={["auto", "auto"]}
            />
            <Tooltip
              labelFormatter={formatTooltipDate}
              formatter={(value: number) => [
                `$${value.toLocaleString()}`,
                "Price",
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#8884d8"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BitcoinPriceChart;

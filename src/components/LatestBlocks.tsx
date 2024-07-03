import React, { useState, useEffect } from "react";

interface Block {
  id: number;
  block_height: number;
  block_hash: string | null;
  block_timestamp: number | null;
  tx_count: number | null;
  block_size: number | null;
}

const LatestBlocks: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlocks = async () => {
    try {
      const response = await fetch("http://34.31.232.228:3001/blockchain_metrics");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setBlocks(data);
    } catch (error) {
      setError("Failed to fetch blocks");
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
    const intervalId = setInterval(fetchBlocks, 20000);
    return () => clearInterval(intervalId);
  }, [fetchBlocks]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Latest Blocks</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {blocks.map((block) => (
            <li key={block.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-indigo-600 truncate">
                  Block {block.block_height}
                </p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {block.block_timestamp
                      ? new Date(block.block_timestamp * 1000).toLocaleString()
                      : "Timestamp not available"}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {block.block_hash
                      ? `${block.block_hash.substr(20, 31)}...`
                      : "Hash not available"}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <span className="mr-2">
                    Transactions: {block.tx_count ?? "N/A"}
                  </span>
                  <span>
                    Size:{" "}
                    {block.block_size ? `${block.block_size} bytes` : "N/A"}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LatestBlocks;

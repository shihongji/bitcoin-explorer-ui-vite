import React from 'react';

interface Block {
  height: number;
  hash: string;
  time: number;
}

const LatestBlocks: React.FC = () => {
  // This is mock data. In a real application, you'd fetch this from your API
  const blocks: Block[] = [
    { height: 800000, hash: '000000000000000000046e8d...', time: 1687890123 },
    { height: 799999, hash: '000000000000000000012a3b...', time: 1687889234 },
    { height: 799998, hash: '000000000000000000098c7d...', time: 1687888345 },
  ];

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Latest Blocks</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {blocks.map((block) => (
            <li key={block.height} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-indigo-600 truncate">
                  Block {block.height}
                </p>
                <div className="ml-2 flex-shrink-0 flex">
                  <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {new Date(block.time * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {block.hash.substr(0, 20)}...
                  </p>
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

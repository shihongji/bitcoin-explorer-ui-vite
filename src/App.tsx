import Header from './components/Header';
import Footer from './components/Footer';
import BlockchainMetricsChart from './components/BlockchainMetricsChart';
import LatestBlocks from './components/LatestBlocks';
import BitcoinPriceChart from './components/BitcoinPriceChart';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Bitcoin Metrics Example</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <BlockchainMetricsChart />
          <BitcoinPriceChart />
        </div>
        <LatestBlocks />
      </main>
      <Footer />
    </div>
  );
}

export default App;

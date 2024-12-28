import { useEffect, useState } from 'react';
import axios from 'axios';

interface PortfolioStock {
  StockSymbol: string;
  Quantity: number;
  TotalInvestment: number;
  CurrentPrice: number;
}

interface Stock {
  StockSymbol: string;
  CurrentPrice: number;
}

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioStock[]>([]);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPortfolio = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get('http://localhost:5000/api/portfolio/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolio(data.portfolio);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const fetchStocks = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/stocks');
      setStocks(data.stocks);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    fetchStocks();
  }, []);

  const handleBuyStock = async () => {
    if (!selectedStock || !quantity) {
      alert('Please select a stock and enter a quantity');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    const stockPrice = stocks.find(stock => stock.StockSymbol === selectedStock)?.CurrentPrice;
    if (!stockPrice) {
      alert('Stock price not found');
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/portfolio/buy',
        { stockSymbol: selectedStock, quantity: Number(quantity), price: stockPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchPortfolio();  

      setQuantity(''); 
    } catch (error) {
      console.error('Error buying stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSellStock = async () => {
    if (!selectedStock || !quantity) {
      alert('Please select a stock and enter a quantity');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    try {
      await axios.post(
        'http://localhost:5000/api/portfolio/sell',
        { stockSymbol: selectedStock, quantity: Number(quantity) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchPortfolio();  

      setQuantity(''); 
    } catch (error) {
      console.error('Error selling stock:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Portfolio</h1>

      {/* Portfolio Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full table-auto text-left">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Quantity</th>
              <th className="px-6 py-4">Total Investment</th>
              <th className="px-6 py-4">Current Price</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((stock, index) => (
              <tr
                key={index}
                className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}
              >
                <td className="px-6 py-4 text-black">{stock.StockSymbol}</td>
                <td className="px-6 py-4 text-black">{stock.Quantity}</td>
                <td className="px-6 py-4 text-black">${stock.TotalInvestment}</td>
                <td className="px-6 py-4 text-black">${stock.CurrentPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buy/Sell Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Stocks</h2>

        <div className="mb-4">
          <select
            className="w-full p-3 border rounded-lg bg-gray-100 focus:outline-none"
            value={selectedStock}
            onChange={e => setSelectedStock(e.target.value)}
          >
            <option value="">Select Stock</option>
            {stocks.map(stock => (
              <option key={stock.StockSymbol} value={stock.StockSymbol}>
                {stock.StockSymbol} - ${stock.CurrentPrice}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <input
            type="number"
            className="w-full p-3 border rounded-lg bg-gray-100"
            placeholder="Quantity"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
        </div>

        <div className="flex space-x-4">
          <button
            className={`w-full p-3 rounded-lg text-white ${loading ? 'bg-gray-500' : 'bg-green-500'}`}
            onClick={handleBuyStock}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Buy Stock'}
          </button>
          <button
            className={`w-full p-3 rounded-lg text-white ${loading ? 'bg-gray-500' : 'bg-red-500'}`}
            onClick={handleSellStock}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Sell Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../utils/connectors';

interface Trade {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { activate, account } = useWeb3React();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/trades', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrades(response.data);
      } catch (error) {
        console.error('Failed to fetch trades:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();

    const reconnectWallet = async () => {
      const isAuthorized = await injected.isAuthorized();
      console.log('isAuthorized:', isAuthorized);
      if (isAuthorized) {
        try {
          await activate(injected);
          console.log('Wallet reconnected successfully');
        } catch (err) {
          console.error('Failed to reconnect wallet:', err);
        }
      } else {
        console.log('Wallet is not authorized');
      }
    };

    reconnectWallet();
    
  }, [activate]);

  console.log('account >>>>>', account);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's an overview of your trading activity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Connected Wallet</h3>
          <p className="mt-2 text-sm text-gray-600">
            {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Not connected'}
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Total Trades</h3>
          <p className="mt-2 text-2xl font-semibold text-primary-600">
            {trades.length}
          </p>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          <div className="mt-4 space-y-2">
            <Link
              to="/trade"
              className="block w-full text-center btn-primary"
            >
              New Trade
            </Link>
            <button className="block w-full text-center btn-primary bg-gray-600 hover:bg-gray-700">
              View History
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Trades</h2>
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : trades.length === 0 ? (
          <div className="text-center py-4 text-gray-600">
            No trades found. Start trading to see your history here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {trades.map((trade) => (
                  <tr key={trade.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          trade.type === 'buy'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {trade.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {trade.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${trade.price ? trade.price : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(trade.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 
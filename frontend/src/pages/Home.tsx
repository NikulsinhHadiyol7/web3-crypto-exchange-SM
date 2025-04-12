import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Welcome to Web3 Crypto Exchange
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Trade cryptocurrencies securely with Web3 technology
        </p>
        <div className="space-x-4">
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
          <Link to="/login" className="btn-primary bg-gray-600 hover:bg-gray-700">
            Login
          </Link>
        </div>
      </div>
      
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Secure Trading</h3>
          <p className="text-gray-600">
            Trade cryptocurrencies with advanced security measures and Web3 integration
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Real-time Prices</h3>
          <p className="text-gray-600">
            Get instant price updates and market data for informed trading decisions
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Wallet Integration</h3>
          <p className="text-gray-600">
            Connect your Web3 wallet and trade directly from your account
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 
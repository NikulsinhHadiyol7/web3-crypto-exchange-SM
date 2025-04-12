import React from 'react';
import { Link } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../utils/connectors';

const Navbar: React.FC = () => {
  const { account, activate, deactivate } = useWeb3React();

  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = () => {
    try {
      deactivate();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600">Web3 Exchange</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {account ? (
              <>
                <span className="text-sm text-gray-600">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="btn-primary"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={connectWallet}
                className="btn-primary"
              >
                Connect Wallet
              </button>
            )}
            <Link to="/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link to="/register" className="text-gray-600 hover:text-gray-900">
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
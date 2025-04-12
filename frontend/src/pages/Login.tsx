import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../utils/connectors';


const Login: React.FC = () => {
  const navigate = useNavigate();
  const { activate, account } = useWeb3React();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const connectWallet = async () => {
    try {
      console.log('Attempting to connect wallet...');
      await activate(injected);
      console.log('Wallet connected successfully', account);
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      throw new Error('Failed to connect wallet');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login...');
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log('Login response:', response.data);

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        console.log('Token stored successfully');
        
        try {
          // Connect wallet after successful login
          await connectWallet();
          
          // Wait for a short moment to ensure the wallet connection is established
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          console.log('Attempting navigation to /trade...');
          navigate('/dashboard', { replace: true });
          console.log('Navigation completed');
        } catch (err: any) {
          console.error('Wallet connection or navigation error:', err);
          setError(err.message || 'Failed to connect wallet or redirect. Please try again.');
        }
      } else {
        setError('Invalid response from server');
        console.error('No token in response:', response.data);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center">{error}</div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field rounded-t-md"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field rounded-b-md"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button 
              type="submit" 
              className={`btn-primary w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 
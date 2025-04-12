import React from 'react';
import { Navigate } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { account } = useWeb3React();

  console.log('account', account);
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('No token found, redirecting to login');
    return <Navigate to="/login" />;
  }

  // if (!account) {
  //   console.log('2 No wallet connected, redirecting to login');
  //   return <Navigate to="/login" />;
  // }

  return <>{children}</>;
};

export default PrivateRoute; 
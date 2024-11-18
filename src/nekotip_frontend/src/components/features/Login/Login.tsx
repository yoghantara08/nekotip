import React from 'react';

import useAuth from '@/hooks/useAuth';
import useUser from '@/hooks/useUser';

const Login = () => {
  const { handleLogin, isAuthenticated, logoutUser, isLoading } = useAuth();
  const { user } = useUser();

  return (
    <div>
      {isAuthenticated ? (
        <>
          <div className="text-2xl font-bold">User ID: {user?.id}</div>
          <div className="text-2xl font-bold">Username: {user?.username}</div>
          <div className="text-2xl font-bold">
            Wallet Address: {user?.depositAddress}
          </div>
          <button onClick={logoutUser}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      )}
    </div>
  );
};

export default Login;

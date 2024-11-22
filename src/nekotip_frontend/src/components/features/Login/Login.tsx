import React, { useEffect, useState } from 'react';

import { Principal } from '@dfinity/principal';
import BigNumber from 'bignumber.js';

import useAuth from '@/hooks/useAuth';
import useICPLedgerPayment from '@/hooks/useICPLedgerPayment';
import useUser from '@/hooks/useUser';

import { canisterId } from '../../../../../declarations/nekotip_backend';

const Login = () => {
  const { handleLogin, isAuthenticated, logoutUser, isLoading } = useAuth();
  const { user, getICPBalance } = useUser();
  const { transferICP } = useICPLedgerPayment();

  const [balance, setBalance] = useState<bigint | undefined>(BigInt(0));
  const [result, setResult] = useState<bigint>();

  const transfer = async () => {
    const recipientPrincipal = Principal.fromText(canisterId);
    const e8sAmount = BigInt(
      BigNumber(1)
        .multipliedBy(10 ** 8)
        .toNumber(),
    );

    const result = await transferICP(recipientPrincipal, e8sAmount);
    if (result) setResult(result);
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getICPBalance();
      setBalance(balance);
    };

    fetchBalance();
  }, []);

  return (
    <div>
      {isAuthenticated ? (
        <>
          <div className="text-2xl font-bold">User ID: {user?.id}</div>
          <div className="text-2xl font-bold">Username: {user?.username}</div>
          <div className="text-2xl font-bold">
            Wallet Address: {user?.depositAddress}
          </div>
          <div className="text-2xl font-bold">
            Balance: {balance?.toString()}
          </div>
          <div className="text-2xl font-bold">Result: {result?.toString()}</div>

          <button onClick={transfer}>Transfer</button>
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

import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AuthClient } from '@dfinity/auth-client';
import { AccountIdentifier } from '@dfinity/ledger-icp';

import { INTERNET_IDENTITY_URL } from '@/constant/common';
import { AppDispatch, RootState } from '@/store';
import { setIsAuthenticated } from '@/store/reducers/userSlice';

import useActor from './useActor';
import useUser from './useUser';

const useAuth = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { updateUser, referralCode } = useUser();
  const { getAuthenticatedActor } = useActor();

  const [isLoading, setIsLoading] = useState(false);

  const updateAuthentication = useCallback(
    (status: boolean) => {
      dispatch(setIsAuthenticated(status));
    },
    [dispatch],
  );

  // Handle login with internet identity
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const authClient = await AuthClient.create();

      await authClient.login({
        identityProvider: INTERNET_IDENTITY_URL,
        onSuccess: async () => {
          const isAuthenticated = await authClient.isAuthenticated();

          if (!isAuthenticated) {
            throw new Error('User not authenticated');
          }

          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal();
          const authenticatedActor = await getAuthenticatedActor(identity);

          // Generate Deposit Address
          const accountIdentifier = AccountIdentifier.fromPrincipal({
            principal,
            subAccount: undefined,
          });

          const depositAddressHex = accountIdentifier.toHex();

          // Authenticate user with the backend canister
          const result = await authenticatedActor.authenticateUser(
            `user_${principal.toString().slice(0, 8)}`,
            depositAddressHex,
            referralCode ? [referralCode] : [],
          );

          if ('ok' in result) {
            // Update state
            updateUser(result.ok);
            updateAuthentication(true);
            navigate('/dashboard', { replace: true });
          } else {
            throw new Error(result.err);
          }
        },
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 1 week
        onError: (error) => {
          console.error('Login failed:', error);
          logoutUser();
        },
      });
    } catch (error) {
      console.error('Login failed:', error);
      logoutUser();
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logoutUser = useCallback(async () => {
    const authClient = await AuthClient.create();

    try {
      await authClient.logout();
      updateUser(null);
      updateAuthentication(false);

      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  }, [navigate, updateAuthentication, updateUser]);

  // Check authentication session
  const checkSession = useCallback(async () => {
    const authData = localStorage.getItem('ic-delegation');
    if (!authData) {
      console.log('AuthClient not initialized in localStorage');
      return;
    }

    const authClient = await AuthClient.create();
    const isAuthenticated = await authClient.isAuthenticated();

    if (!isAuthenticated) {
      logoutUser();
    }
  }, [logoutUser]);

  return {
    isAuthenticated,
    updateAuthentication,
    logoutUser,
    handleLogin,
    checkSession,
    isLoading,
  };
};

export default useAuth;

import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Actor, HttpAgent, Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import type { Principal } from '@dfinity/principal';

import {
  BACKEND_CANISTER_ID,
  DFX_NETWORK,
  INTERNET_IDENTITY_URL,
} from '@/constant/common';
import { serializeUser } from '@/lib/utils';
import { AppDispatch, RootState } from '@/store';
import { setIsAuthenticated, setUser } from '@/store/reducers/userSlice';

import { idlFactory } from '../../../declarations/nekotip_backend';
import { _SERVICE } from '../../../declarations/nekotip_backend/nekotip_backend.did';

// Types
interface AuthState {
  identity: Identity | null;
  principal: Principal | null;
  actor: _SERVICE | null;
  isLoading: boolean;
}

export const useAuthManager = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, referralCode } = useSelector(
    (state: RootState) => state.user,
  );

  const [authState, setAuthState] = useState<AuthState>({
    identity: null,
    principal: null,
    actor: null,
    isLoading: false,
  });

  // Create actor instance
  const createActor = useCallback(
    async (identity?: Identity): Promise<_SERVICE> => {
      const agent = await HttpAgent.create({
        identity,
        shouldFetchRootKey: DFX_NETWORK === 'local',
      });

      return Actor.createActor(idlFactory, {
        agent,
        canisterId: BACKEND_CANISTER_ID,
      }) as unknown as _SERVICE;
    },
    [],
  );

  // Initialize or update auth state
  const initializeAuth = useCallback(async () => {
    const authClient = await AuthClient.create();
    if (await authClient.isAuthenticated()) {
      const identity = authClient.getIdentity();
      const principal = identity.getPrincipal();
      const actor = await createActor(identity);

      setAuthState({
        identity,
        principal,
        actor,
        isLoading: false,
      });
      dispatch(setIsAuthenticated(true));
    } else {
      const anonymousActor = await createActor();
      setAuthState({
        identity: null,
        principal: null,
        actor: anonymousActor,
        isLoading: false,
      });
      dispatch(setUser(null));
      dispatch(setIsAuthenticated(false));
    }
  }, [createActor, dispatch]);

  // Logout handler
  const logout = useCallback(async () => {
    const authClient = await AuthClient.create();
    try {
      await authClient.logout();
      const anonymousActor = await createActor();

      setAuthState({
        identity: null,
        principal: null,
        actor: anonymousActor,
        isLoading: false,
      });
      dispatch(setUser(null));
      dispatch(setIsAuthenticated(false));
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [createActor, dispatch, navigate]);

  // Login handler
  const login = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    try {
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: INTERNET_IDENTITY_URL,
        maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 1 week
        onSuccess: async () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal();
          const actor = await createActor(identity);

          // Generate Deposit Address
          const accountIdentifier = AccountIdentifier.fromPrincipal({
            principal,
            subAccount: undefined,
          });

          const result = await actor.authenticateUser(
            principal.toString().slice(0, 8),
            accountIdentifier.toHex(),
            [referralCode],
          );

          if ('ok' in result) {
            setAuthState({
              identity,
              principal,
              actor,
              isLoading: false,
            });
            dispatch(setUser(serializeUser(result.ok)));
            dispatch(setIsAuthenticated(true));
            navigate('/dashboard', { replace: true });
          } else {
            throw new Error(result.err);
          }
        },
        onError: (error) => {
          console.error('Login failed:', error);
          logout();
        },
      });
    } catch (error) {
      console.error('Login failed:', error);
      logout();
    }
  }, [createActor, dispatch, logout, navigate, referralCode]);

  return useMemo(
    () => ({
      identity: authState.identity,
      principal: authState.principal,
      actor: authState.actor,
      isAuthenticated,
      isLoading: authState.isLoading,

      login,
      logout,
      initializeAuth,
    }),
    [authState, isAuthenticated, login, logout, initializeAuth],
  );
};

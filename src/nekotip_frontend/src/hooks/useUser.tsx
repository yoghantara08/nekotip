import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Principal } from '@dfinity/principal';

import { AppDispatch, RootState } from '@/store';
import { setReferralCode } from '@/store/reducers/userSlice';

import { _SERVICE } from '../../../declarations/nekotip_backend/nekotip_backend.did';

import { useAuthManager } from './useAuthManager';

const useUser = () => {
  const { user, referralCode } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();

  const { actor, isAuthenticated } = useAuthManager();

  const fetchUser = useCallback(
    async (principal: Principal, actor: _SERVICE) => {
      try {
        return await actor.getUserById(principal);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        throw error;
      }
    },
    [],
  );

  const updateReferralCode = useCallback(
    (code: string): void => {
      dispatch(setReferralCode(code));
    },
    [dispatch],
  );

  const getICPBalance = useCallback(async () => {
    if (!isAuthenticated || !actor) {
      throw new Error(
        !isAuthenticated ? 'User not authenticated' : 'Actor is unavailable',
      );
    }

    try {
      return (await actor.getAccountBalance()) ?? 0;
    } catch (error) {
      console.error('Failed to fetch ICP balance:', error);
      throw error;
    }
  }, [isAuthenticated, actor]);

  return {
    user,
    referralCode,
    fetchUser,
    updateReferralCode,
    getICPBalance,
  };
};

export default useUser;

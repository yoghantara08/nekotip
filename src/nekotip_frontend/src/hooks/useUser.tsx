import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { serializeUser } from '@/lib/utils';
import { AppDispatch, RootState } from '@/store';
import { useAuthManager } from '@/store/AuthProvider';
import { setReferralCode, setUser } from '@/store/reducers/userSlice';

import { User } from '../../../declarations/nekotip_backend/nekotip_backend.did';

const useUser = () => {
  const { user, referralCode } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();

  const { actor, isAuthenticated } = useAuthManager();

  const updateUser = (user: User) => {
    dispatch(setUser(serializeUser(user)));
  };

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
    updateReferralCode,
    getICPBalance,
    updateUser,
  };
};

export default useUser;

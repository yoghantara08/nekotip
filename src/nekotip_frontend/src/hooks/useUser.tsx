import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Principal } from '@dfinity/principal';

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

  const getUserById = async (userId: string) => {
    if (!actor) {
      return;
    }

    try {
      const result = await actor.getUserById(Principal.fromText(userId));

      if (result) {
        return result[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching creator content:', error);
    }
  };

  const getUserByUsername = async (username: string) => {
    if (!actor) {
      return;
    }

    try {
      const result = await actor.getUserByUsername(username);

      if (result) {
        return result[0];
      }
      return null;
    } catch (error) {
      console.error('Error fetching creator content:', error);
    }
  };

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
    getUserById,
    getUserByUsername,
    updateReferralCode,
    getICPBalance,
    updateUser,
  };
};

export default useUser;

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { serializeUser } from '@/lib/utils';
import { AppDispatch, RootState } from '@/store';
import { setReferralCode, setUser } from '@/store/reducers/userSlice';

import {
  User,
  UserUpdateData,
} from '../../../declarations/nekotip_backend/nekotip_backend.did';

import useActor from './useActor';

const useUser = () => {
  const { user, referralCode } = useSelector((state: RootState) => state.user);
  const dispatch: AppDispatch = useDispatch();

  const { getActor } = useActor();

  const updateUser = (user: User | null) => {
    if (user) dispatch(setUser(serializeUser(user)));
    return;
  };

  const updateUserProfile = async (updateData: UserUpdateData) => {
    try {
      const actor = await getActor();
      const result = await actor.updateUserProfile(updateData);

      if ('ok' in result) {
        updateUser(result.ok);
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  };

  const updateReferralCode = useCallback(
    (code: string) => {
      dispatch(setReferralCode(code));
    },
    [dispatch],
  );

  const getICPBalance = async () => {
    try {
      const actor = await getActor();
      const result = await actor.getAccountBalance();

      return result;
    } catch (error) {
      console.error(error);
    }
  };

  return {
    user,
    referralCode,
    updateUser,
    updateUserProfile,
    updateReferralCode,
    getICPBalance,
  };
};

export default useUser;

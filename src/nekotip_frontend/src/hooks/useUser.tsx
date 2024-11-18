import { useDispatch, useSelector } from 'react-redux';

import { serializeUser } from '@/lib/utils';
import { AppDispatch, RootState } from '@/store';
import { setIsAuthenticated, setUser } from '@/store/reducers/userSlice';

import { User } from '../../../declarations/nekotip_backend/nekotip_backend.did';

const useUser = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.user,
  );
  const dispatch: AppDispatch = useDispatch();

  const updateUser = (user: User | null) => {
    if (user) dispatch(setUser(serializeUser(user)));
    return;
  };

  const updateAuthentication = (status: boolean) => {
    dispatch(setIsAuthenticated(status));
  };

  const logoutUser = () => {
    updateUser(null);
    updateAuthentication(false);
  };

  return {
    user,
    isAuthenticated,
    updateUser,
    updateAuthentication,
    logoutUser,
  };
};

export default useUser;

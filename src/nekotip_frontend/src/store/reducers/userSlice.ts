import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ISerializedUser } from '@/types/user.types';

interface userState {
  user: ISerializedUser | null;
  isAuthenticated: boolean;
  referralCode: string;
}

const initialState: userState = {
  user: null,
  isAuthenticated: false,
  referralCode: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<ISerializedUser | null>) => {
      state.user = action.payload;
    },
    setIsAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setReferralCode: (state, action: PayloadAction<string>) => {
      state.referralCode = action.payload;
    },
  },
});

export const { setUser, setIsAuthenticated, setReferralCode } =
  userSlice.actions;
const userReducer = userSlice.reducer;

export default userReducer;

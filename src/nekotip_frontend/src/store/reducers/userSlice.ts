import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ISerializedUser } from '@/types';

interface userState {
  user: ISerializedUser | null;
  isAuthenticated: boolean;
  referralCode: string;
  icpPrice: number;
}

const initialState: userState = {
  user: null,
  isAuthenticated: false,
  referralCode: '',
  icpPrice: 0,
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
    setIcpPrice: (state, action: PayloadAction<number>) => {
      state.icpPrice = action.payload;
    },
  },
});

export const { setUser, setIsAuthenticated, setReferralCode, setIcpPrice } =
  userSlice.actions;
const userReducer = userSlice.reducer;

export default userReducer;

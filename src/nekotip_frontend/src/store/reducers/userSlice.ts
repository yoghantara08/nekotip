import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface userState {
  principal: string
}

const initialState: userState = {
  principal: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPrincipal: (state, action: PayloadAction<string>) => {
      state.principal = action.payload
    },
  },
})

export const { setPrincipal } = userSlice.actions
const userReducer = userSlice.reducer

export default userReducer

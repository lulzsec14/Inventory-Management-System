import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: { value: true },
  reducers: {
    addAuth: (state, action) => {
      state.value = true;
    },
    removeAuth: (state, action) => {
      state.value = false;
    },
  },
});

export const { addAuth, removeAuth } = authSlice.actions;

export default authSlice.reducer;

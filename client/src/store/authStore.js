import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

// const isAuth = JSON.parse(Cookies.get('auth'));

export const authSlice = createSlice({
  name: 'auth',
  initialState: { value: {} },
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

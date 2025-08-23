// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import problemReducer from './slices/problemSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemReducer,
  },
});
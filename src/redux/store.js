// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../redux/Slices/productsSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
  },
});

// src/redux/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('http://localhost:3000/products');
  return response.json();
});

// Async thunk to fetch lists
export const fetchLists = createAsyncThunk('products/fetchLists', async () => {
  const response = await fetch('http://localhost:3000/Lists');
  return response.json();
});

// Async thunk to add a product
export const addProduct = createAsyncThunk('products/addProduct', async (newProduct) => {
  const response = await fetch('http://localhost:3000/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newProduct),
  });
  return response.json();
});

// Async thunk to update a product
export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, updatedData }) => {
  const response = await fetch(`http://localhost:3000/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  });
  return response.json();
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    lists: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.lists = action.payload;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(product => product.id === action.payload.id);
        state.products[index] = action.payload;
      });
  },
});

export default productSlice.reducer;

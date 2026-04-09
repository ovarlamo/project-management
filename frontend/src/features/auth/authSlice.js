import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../services/api';

export const loginThunk = createAsyncThunk('auth/login', async (credentials) => api.post('/auth/login', credentials));
export const meThunk = createAsyncThunk('auth/me', async () => api.get('/auth/me'));
export const logoutThunk = createAsyncThunk('auth/logout', async () => api.post('/auth/logout', {}));

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, checked: false, error: '' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.checked = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(meThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.checked = true;
      })
      .addCase(meThunk.rejected, (state) => {
        state.user = null;
        state.checked = true;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export default authSlice.reducer;

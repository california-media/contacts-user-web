
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../axios/axiosInstance';

export const fetchReferralData = createAsyncThunk(
  'referral/fetchReferralData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/my-referrals');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const referralSlice = createSlice({
  name: 'referral',
  initialState: {
    data: {
      creditBalance: 0,
      referralCount: 0,
      referralUrl: '',
      referrals: [],
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferralData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReferralData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // ✅ Only saving `data`
      })
      .addCase(fetchReferralData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default referralSlice.reducer;

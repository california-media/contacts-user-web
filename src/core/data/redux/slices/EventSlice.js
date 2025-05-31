import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../axios/axiosInstance";

export const profileEvents = createAsyncThunk(
  "events/fetchEvents",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/getProfileEvent");

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const eventSlice = createSlice({
  name: "events",
  initialState: {
    data: [],
    loading: false,
  },
  reducers: {
     mergeGoogleEvents: (state, action) => {
        console.log(action.payload,"payload from google events");
        
    const nonGoogleEvents = state.data.filter(event => !event.googleEvent);
    state.data = [...nonGoogleEvents, ...action.payload];
  },
  clearGoogleEvents: (state) => {
    state.data = state.data.filter(event => !event.googleEvent);
  }
  },
  extraReducers: (builder) => {
    builder.addCase(profileEvents.pending, (state, action) => {
      state.loading = true;
    })
    .addCase(profileEvents.fulfilled,(state,action)=>{
        state.loading = false;
        state.data = action.payload
    })
    .addCase(profileEvents.rejected, (state, action) =>
        state.loading = false
    );
  },
});
export const { mergeGoogleEvents,clearGoogleEvents } = eventSlice.actions;
export default eventSlice.reducer;

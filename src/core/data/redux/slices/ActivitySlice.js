
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../axios/axiosInstance";



export const fetchContactActivities = createAsyncThunk(
  "activity/fetchContactActivities",
  async (contact_id, { rejectWithValue }) => {
    try {
        console.log(contact_id,"ddsegsrgwregwr");
        
      const response = await api.post("/getContactActivities", {contact_id:contact_id});
      console.log(response.data,"response from fetch activities");
      
      return response.data.data;
    } catch (error) {
        console.log("ahdgfjsdvfnsdbvndb");
        
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const activitySlice = createSlice({
  name: "activity",
  initialState: {
    activities: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearActivities: (state) => {
      state.activities = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchContactActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearActivities } = activitySlice.actions;
export default activitySlice.reducer;

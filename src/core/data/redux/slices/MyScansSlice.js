import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../axios/axiosInstance";

export const myScans = createAsyncThunk("myScans/getScans", async () => {
  const response = await api.get("/api/scan/get_data");
  console.log(response.data,"responseee");
  
  return response.data;
});

const myScansSlice = createSlice({
  name: "myScans",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(myScans.fulfilled, (state, action) => {
     
      return action.payload.data;
    })
    .addCase(myScans.pending,(state,action)=>{})
    .addCase(myScans.rejected,(state,action)=>{})
  }
});
export default myScansSlice.reducer;
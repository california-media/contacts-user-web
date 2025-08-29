import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../axios/axiosInstance";

export const myScans = createAsyncThunk("myScans/getScans", async () => {
console.log("inside myScans api");

  const payload = {apiType:"web"};
  console.log("payload in myScans api",payload);
  
  const response = await api.post("/scan/get_data",payload);
  console.log(response.data,"response from scan api");
  
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
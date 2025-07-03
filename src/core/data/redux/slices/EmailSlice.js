import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../axios/axiosInstance";
import { showToast } from "./ToastSlice";

export const sendEmail = createAsyncThunk(
  "email/sendEmail",
  async (emailData, { rejectWithValue, dispatch }) => {
    try {
      console.log(emailData,"email data before going to api");
      
      const response = await api.post("/sendEmail", emailData);
      console.log(response.data,"response from send email");
      
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const emailSlice = createSlice({
  name: "email",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetEmailState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendEmail.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(sendEmail.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(sendEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send email";
      });
  },
});

export const { resetEmailState } = emailSlice.actions;
export default emailSlice.reducer;

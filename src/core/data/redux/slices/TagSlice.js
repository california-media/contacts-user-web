import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../../axios/axiosInstance";
import { showToast } from "./ToastSlice";

export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/getTag");
      console.log(response.data,"response from tags");
      
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addTag = createAsyncThunk(
  "tags/addTag",
  async (tag, { rejectWithValue, dispatch }) => {
    console.log(tag,"taggggggsss");
    
    try {
      const response = await api.post("/addTag", tag);
      console.log(response.data.data, "response from add tag");
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
      return response.data.data;
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteTag = createAsyncThunk(
  "tags/deleteTag",
  async (tagId, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete("/deleteTag", {
        data: { tag_id: tagId },
      });
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
      return response.data.data.tag_id;
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
      return rejectWithValue(error.response.data);
    }
  }
);

const tagSlice = createSlice({
  name: "tags",
  initialState: {
    tags: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTags.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.loading = false;
      state.tags = action.payload;
    });
    builder.addCase(fetchTags.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(addTag.pending, (state) => {
      state.loading = true;
    });
    // builder.addCase(addTag.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.tags.push(action.payload);
    // });
    builder.addCase(addTag.fulfilled, (state, action) => {
      state.loading = false;
      state.tags = [...state.tags, ...action.payload];
    });
    builder.addCase(addTag.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(deleteTag.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteTag.fulfilled, (state, action) => {
      state.loading = false;
      state.tags = state.tags.filter((tag) => tag.tag_id !== action.payload);
    });
    builder.addCase(deleteTag.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default tagSlice.reducer;

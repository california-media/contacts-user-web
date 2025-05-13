import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../axios/axiosInstance";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async ({ filters }, { rejectWithValue }) => {
    const id = filters.id;
    const page = filters.page;
    const limit = filters.limit;
    try {
      const response = await api.post("/getContact", { id, page, limit });
        console.log("response.data.pagination.totalContacts",response.data.pagination.totalContacts)
      return { data: response.data.data, totalContacts:response.data.pagination.totalContacts };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveContact = createAsyncThunk(
  "contacts/saveContact",
  async (contactData, { rejectWithValue }) => {
    try {
      const { id, ...data } = contactData;
      const response = await api.post("addEditContact", {
        id: id ?? 0, // If id is 0 or undefined, it creates a new contact
        ...data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (contactId, { rejectWithValue }) => {
    try {
      await api.delete("/deleteContact");
      return contactId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const contactSlice = createSlice({
  name: "contacts",
  initialState: {
    contacts: [],
    page: 1,
    limit: 20,
    totalPages: 0,
    totalContacts:0,
    loading: false,
    error: null,
  },
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchContacts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchContacts.fulfilled, (state, action) => {
      state.loading = false;
      state.totalPages = action.payload.totalPages;
      state.contacts = action.payload.data;
      state.totalContacts = action.payload.totalContacts;
    });
    builder.addCase(fetchContacts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    builder.addCase(saveContact.fulfilled, (state, action) => {
      const index = state.contacts.findIndex(
        (contact) => contact.id === action.payload.id
      );

      if (index !== -1) {
        state.contacts[index] = action.payload;
      } else {
        state.contacts.push(action.payload);
      }
    });

    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.contacts = state.contacts.filter((c) => c.id !== action.payload);
    });
  },
});

// Export actions and reducer
export const { setPage } = contactSlice.actions;
export default contactSlice.reducer;

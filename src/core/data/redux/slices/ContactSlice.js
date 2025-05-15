import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../axios/axiosInstance";
import { setSelectedContact } from "./SelectedContactSlice";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async ({ filters }, { rejectWithValue }) => {
    const id = filters.id;
    const page = filters.page;
    const limit = filters.limit;
    const search = filters.search;
    const tag = filters.tag;
    try {
      const response = await api.post("/getContact", { id, page, limit,search, tag });

      return {
        data: response.data.data,
        totalContacts: response.data.pagination.totalContacts,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const saveContact = createAsyncThunk(
  "contacts/saveContact",
  async (formData, { rejectWithValue,dispatch }) => {
    
    try {
      const response = await api.post(
        "addEditContact",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
dispatch(setSelectedContact(response.data.data));
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (contactId, { rejectWithValue }) => {
    try {
   const response = await api.delete("/deleteContact",{data:{contact_id:contactId}});
      
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
    totalContacts: 0,
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
      console.log(action.payload,"payload after updatation");
      
      const index = state.contacts.findIndex(
        (contact) => contact.contact_id === action.payload.contact_id
      );

      if (index !== -1) {
        state.contacts[index] = action.payload;
      } else {
        state.contacts.push(action.payload);
      }
      
    });

    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.contacts = state.contacts.filter((c) => c.contact_id !== action.payload);
    });
  },
});

// Export actions and reducer
export const { setPage } = contactSlice.actions;
export default contactSlice.reducer;

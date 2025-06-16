import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../axios/axiosInstance";
import { setSelectedContact } from "./SelectedContactSlice";
import { showToast } from "./ToastSlice";

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async ({ filters }, { rejectWithValue }) => {
    console.log("filters in fetchContacts", filters);
    const isFavourite = filters.isFavourite;
    const favouriteContactsPage = filters.favouriteContactsPage;
    const favouriteContactsLimit = filters.favouriteContactsLimit;
    const favouriteContactsSearch = filters.favouriteContactsSearch;
    const id = filters.id;
    const page = filters.page;
    const limit = filters.limit;
    const search = filters.search;
    const tag = filters.tag;
    try {
      const response = await api.post("/getContact", {
        id,
        page,
        limit,
        search,
        tag,
        isFavourite,
        favouriteContactsPage,
        favouriteContactsLimit,
        favouriteContactsSearch,
      });
      console.log("response from fetchContacts", response.data);

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
  async (formData, { rejectWithValue, dispatch }) => {
 console.log("object before going to api in slice:", Object.fromEntries(formData.entries()));
    try {
      const response = await api.post("addEditContact", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("response from saveContact", response.data);
      console.log(response.data.data, "response from add edit contact");
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
      dispatch(setSelectedContact(response.data.data));
      return response.data.data;
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );

      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (contactId, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete("/deleteContact", {
        data: { contact_id: contactId },
      });
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
      return contactId;
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (deleteTaskData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete("/deleteTask", {
        data: deleteTaskData,
      });
      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
      return response.data.data.task_id;
      // return deleteTaskData.task_id;
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
      return rejectWithValue(error.response.data);
    }
  }
);
export const deleteMeeting = createAsyncThunk(
  "meetings/deleteMeeting",
  async (deleteMeetingData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.delete("/deleteMeeting", {
        data: deleteMeetingData,
      });

      dispatch(
        showToast({ message: response.data.message, variant: "success" })
      );
      return response.data.data.meeting_id;
      // return deleteTaskData.task_id;
    } catch (error) {
      dispatch(
        showToast({ message: error.response.data.message, variant: "danger" })
      );
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
    // setPage: (state, action) => {
    //   state.page = action.payload;
    // },
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
        (contact) => contact.contact_id === action.payload.contact_id
      );

      if (index !== -1) {
        state.contacts[index] = action.payload;
      } else {
        state.contacts.push(action.payload);
        state.totalContacts += 1;
      }
    });

    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.contacts = state.contacts.filter(
        (c) => c.contact_id !== action.payload
      );
      state.totalContacts -= 1;
    });
  },
});

// Export actions and reducer
// export const { setPage } = contactSlice.actions;
export default contactSlice.reducer;

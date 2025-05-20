import { createSlice } from "@reduxjs/toolkit";
import { deleteTask } from "./ContactSlice";

const selectedContactSlice = createSlice({
  name: "selectedContact",
  initialState: {
    contact_id: null,
    contactImageURL: "",
    firstname: "",
    lastname: "",
    emailaddresses: [],
    phonenumbers: [],
    tags: [],
    website: "",
    isFavourite: false,
    notes: "",
    tasks:[]
  },
  reducers: {
    setSelectedContact: (state, action) => {      
      return { ...state, ...action.payload };
    },
    resetSelectedContact: () => ({
      contact_id: null,
      contactImageURL: "",
      firstname: "",
      lastname: "",
      emailaddresses: [],
      phonenumbers: [],
      tags: [],
      website: "",
      isFavourite: false,
      notes: "",
         tasks:[]
    }),
  },
  extraReducers: (builder) => { // this extra reducer is imported from the ContactSlice 
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      const deletedTaskId = action.payload;
      state.tasks = state.tasks.filter((task) => task.task_id !== deletedTaskId);
    });
  },
});

export const { setSelectedContact, resetSelectedContact } = selectedContactSlice.actions;
export default selectedContactSlice.reducer;

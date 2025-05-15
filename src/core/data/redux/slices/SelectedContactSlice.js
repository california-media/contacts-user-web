import { createSlice } from "@reduxjs/toolkit";

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
    }),
  },
});

export const { setSelectedContact, resetSelectedContact } = selectedContactSlice.actions;
export default selectedContactSlice.reducer;

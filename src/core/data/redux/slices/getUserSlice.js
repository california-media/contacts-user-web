import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  phonenumber: {
    number: "",
    countryCode: "",
  },
  profileImageURL: "",
  contactCount: 0,
  favouriteCount: 0,
  tagCount: 0,
};
const getUserSlice = createSlice({
  name: "getUser",
  initialState: initialState,
  reducers: {
    setGetUser(state,action){
        // return{...state,...action.payload}
        state.id = action.payload.id;
        state.firstname = action.payload.firstname;
        state.lastname = action.payload.lastname;
        state.email = action.payload.email;
        state.phonenumber = action.payload.phonenumber;
        state.countryCode = action.payload.countryCode;
        state.profileImageURL = action.payload.profileImageURL;
        state.contactCount = action.payload.contactCount;
        state.favouriteCount = action.payload.favouriteCount;
        state.tagCount = action.payload.tagCount;
    },
    clearGetUser(){
        return initialState;
      }
  },
});
export const {setGetUser,clearGetUser}= getUserSlice.actions

export default getUserSlice.reducer
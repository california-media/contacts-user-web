// import { createSlice } from "@reduxjs/toolkit";
// const initialState = {
//   id: "",
//   firstname: "",
//   lastname: "",
//   email: "",
//   phonenumber: {
//     number: "",
//     countryCode: "",
//   },
//   profileImageURL: "",
//   contactCount: 0,
//   favouriteCount: 0,
//   tagCount: 0,
// };
// const getUserSlice = createSlice({
//   name: "getUser",
//   initialState: initialState,
//   reducers: {
//     setGetUser(state,action){
//         // return{...state,...action.payload}
//         state.id = action.payload.id;
//         state.firstname = action.payload.firstname;
//         state.lastname = action.payload.lastname;
//         state.email = action.payload.email;
//         state.phonenumber = action.payload.phonenumber;
//         state.countryCode = action.payload.countryCode;
//         state.profileImageURL = action.payload.profileImageURL;
//         state.contactCount = action.payload.contactCount;
//         state.favouriteCount = action.payload.favouriteCount;
//         state.tagCount = action.payload.tagCount;
//     },
//     clearGetUser(){
//         return initialState;
//       }
//   },
// });
// export const {setGetUser,clearGetUser}= getUserSlice.actions
// export default getUserSlice.reducer

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../axios/axiosInstance";

const initialState = {
  id: "",
  firstname: "",
  lastname: "",
  email: "",
  phonenumbers: [],
  profileImageURL: "",
  contactCount: 0,
  favouriteCount: 0,
  tagCount: 0,
};

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response =await api.get("/getUser");
      console.log( response.data,"response from fetch profile");
      localStorage.setItem("userId",response.data.data.id)
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const editProfile = createAsyncThunk("profile/editProfile",async(profileData,{rejectWithValue})=>{
  try {
    const response = await api.put("/editProfile",profileData,{
      headers: {
          "Content-Type": "multipart/form-data",
        },
    })
    console.log(response.data,"response from edit profile");
    
    return response.data
  } catch (error) {
    return rejectWithValue(error.response.data)
  }
})


const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // return { ...state, ...action.payload };
        Object.assign(state, action.payload);
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })

  },
});

export default profileSlice.reducer
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import appCommonReducer from "./slices/appCommonSlice"; 
import commonSlice from "./commonSlice";
import profileReducer from "./slices/ProfileSlice";
import tagReducer from "./slices/TagSlice"
import referralReducer from "./slices/ReferralSlice"
import contactReducer from "./slices/ContactSlice"
import selectedContactReducer from "./slices/SelectedContactSlice"
import selectedTemplateReducer from "./slices/SelectedTemplateSlice"
import activityReducer from "./slices/ActivitySlice"
import myScansReducer from "./slices/MyScansSlice"
import toastReducer from "./slices/ToastSlice"
import eventReducer from "./slices/EventSlice"
import emailReducer from "./slices/EmailSlice"
import { persistStore, persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["getUser","tags","contacts","selectedContact","setSelectedTemplate","event","myScans","email","activity","referral"],
};
const combinedReducer = combineReducers({
  common: commonSlice,       
  appCommon: appCommonReducer,
  profile: profileReducer,
  tags: tagReducer,
  contacts: contactReducer,
  selectedTemplate:selectedTemplateReducer,
  selectedContact: selectedContactReducer,
  toast:toastReducer,
  referral: referralReducer,
  event:eventReducer,
  myScans:myScansReducer,
  email:emailReducer,
  activity:activityReducer
});

const rootReducer = (state,action) => {
  return combinedReducer(state,action)
}

// const store = configureStore({
//   reducer: rootReducer,
// });

// export default store;

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
});
const persistor = persistStore(store);

export { store, persistor };

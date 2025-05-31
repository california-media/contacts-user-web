import { configureStore, combineReducers } from "@reduxjs/toolkit";
import appCommonReducer from "./slices/appCommonSlice"; 
import commonSlice from "./commonSlice";
import profileReducer from "./slices/ProfileSlice";
import tagReducer from "./slices/TagSlice"
import contactReducer from "./slices/ContactSlice"
import selectedContactReducer from "./slices/SelectedContactSlice"
import selectedTemplateReducer from "./slices/SelectedTemplateSlice"
import toastReducer from "./slices/ToastSlice"
import eventReducer from "./slices/EventSlice"
import { persistStore, persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["getUser","tags","contacts","selectedContact","setSelectedTemplate","event"],
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
  event:eventReducer,
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

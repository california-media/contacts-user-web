import { configureStore, combineReducers } from "@reduxjs/toolkit";
import appCommonReducer from "./slices/appCommonSlice"; 
import commonSlice from "./commonSlice";
import getUserReducer from "./slices/getUserSlice";
import tagReducer from "./slices/TagSlice"
import contactReducer from "./slices/ContactSlice"
import selectedContactReducer from "./slices/SelectedContactSlice"
import { persistStore, persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["getUser","tags","contacts","selectedContact"],
};
const combinedReducer = combineReducers({
  common: commonSlice,       
  appCommon: appCommonReducer,
  getUser: getUserReducer,
  tags: tagReducer,
  contacts: contactReducer,
  selectedContact: selectedContactReducer
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

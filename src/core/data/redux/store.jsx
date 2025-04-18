import { configureStore, combineReducers } from "@reduxjs/toolkit";
import appCommonReducer from "./slices/appCommonSlice"; 
import commonSlice from "./commonSlice";
import getUserReducer from "./slices/getUserSlice";
import { persistStore, persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'

const persistConfig = {
  key: "root",
  storage: storageSession,
  whitelist: ["getUser"]
};
const combinedReducer = combineReducers({
  common: commonSlice,       
  appCommon: appCommonReducer,
  getUser: getUserReducer
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

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import appCommonReducer from "./slices/appCommonSlice"; 
import commonSlice from "./commonSlice";


const combinedReducer = combineReducers({
  common: commonSlice,       
  appCommon: appCommonReducer,
});

const rootReducer = (state,action) => {
  return combinedReducer(state,action)
}

const store = configureStore({
  reducer: rootReducer,
});

// console.log('AppCommon State:', store.getState().appCommon);


// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;
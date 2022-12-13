import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { wallet } from './wallet';
import { security } from './security';
import { indexData } from './index/slice';
import { recods } from './recods';

const rootReducer = combineReducers({
  wallet,
  security,
  indexData: indexData.reducer,
  recods,
});
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
  devTools: true,
});
// useSelector的类型定义
export type RootState = ReturnType<typeof store.getState>;
// dispatch
export type AppDispatch = typeof store.dispatch;

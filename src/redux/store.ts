import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/couter";
import newAccountsSlice from "./slices/NewAccounts";

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    isOpen: newAccountsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

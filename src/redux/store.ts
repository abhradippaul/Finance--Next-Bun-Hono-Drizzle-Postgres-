import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./slices/couter";
import newAccountsSlice from "./slices/NewAccounts";
import newCategorySlice from "./slices/NewCategory";
import newTransactionSlice from "./slices/NewTransaction";

export const store = configureStore({
  reducer: {
    counter: counterSlice,
    accountSheet: newAccountsSlice,
    categorySheet: newCategorySlice,
    transactionSheet: newTransactionSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

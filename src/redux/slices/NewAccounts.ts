import { createSlice } from "@reduxjs/toolkit";

export const newAccountsSlice = createSlice({
  initialState: false,
  name: "isOpen",
  reducers: {
    onChange: (state) => !state,
  },
});

export const { onChange } = newAccountsSlice.actions;
export default newAccountsSlice.reducer;

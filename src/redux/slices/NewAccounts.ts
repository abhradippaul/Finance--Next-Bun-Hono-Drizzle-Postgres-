import { createSlice } from "@reduxjs/toolkit";

interface InitialStateValue {
  isOpen: boolean;
  id?: string | undefined;
}

export const newAccountsSlice = createSlice({
  initialState: {
    isOpen: false,
    id: undefined,
  } as InitialStateValue,
  name: "accountSheet",
  reducers: {
    onOpen: (state, action) => ({
      isOpen: true,
      id: action.payload,
    }),
    onClose: (state) => ({
      isOpen: false,
      id: undefined,
    }),
  },
});

export const { onOpen, onClose } = newAccountsSlice.actions;
export default newAccountsSlice.reducer;

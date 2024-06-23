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
    onOpen: (state) => ({
      isOpen: !state.isOpen,
      id: state.id,
    }),
    onClose: (state) => ({
      isOpen: !state.isOpen,
      id: undefined,
    }),
  },
});

export const { onOpen, onClose } = newAccountsSlice.actions;
export default newAccountsSlice.reducer;

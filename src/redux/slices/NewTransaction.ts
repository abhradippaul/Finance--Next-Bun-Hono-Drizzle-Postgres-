import { createSlice } from "@reduxjs/toolkit";

interface InitialStateValue {
  isOpen: boolean;
  id?: string | undefined;
}

export const newTransactionSlice = createSlice({
  initialState: {
    isOpen: false,
    id: undefined,
  } as InitialStateValue,
  name: "transactionSheet",
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

export const { onOpen, onClose } = newTransactionSlice.actions;
export default newTransactionSlice.reducer;

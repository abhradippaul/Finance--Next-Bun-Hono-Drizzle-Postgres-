import { createSlice } from "@reduxjs/toolkit";

interface InitialStateValue {
  isOpen: boolean;
  id?: string | undefined;
}

export const newCategorySlice = createSlice({
  initialState: {
    isOpen: false,
    id: undefined,
  } as InitialStateValue,
  name: "categorySheet",
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

export const { onOpen, onClose } = newCategorySlice.actions;
export default newCategorySlice.reducer;

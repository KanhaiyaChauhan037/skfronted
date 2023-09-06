import { createSlice } from "@reduxjs/toolkit";

const initialState = {};
const queryDataSlice = createSlice({
  name: "queryData",
  initialState,
  reducers: {
    setQueryData: (state, action) => {
      const { name, value } = action.payload;

      state[name] = value;
      // state[name] = [value];
    },
  },
});

export const { setQueryData } = queryDataSlice.actions;
export default queryDataSlice.reducer;

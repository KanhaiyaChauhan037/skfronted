import fetcher from "@/utils/fetchWrapper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEmployeeData = createAsyncThunk(
  "employees/fetchEmployeeData",
  async ({ _id, name }) => {
    let url = `${process.env.NEXT_PUBLIC_HOST}/api/employees`;

    if (_id) {
      url += `?_id=${_id}`;
    } else if (name) {
      url += `?name=${name}`;
    }
    const response = await fetcher(url);
    const data = await response.json();
    return data;
  }
);
const employeeDataSlice = createSlice({
  name: "employees",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployeeData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchEmployeeData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default employeeDataSlice.reducer;

import fetcher from "@/utils/fetchWrapper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchEmployees = createAsyncThunk(
  "employees/fetchEmployees",

  async ({ _id, name, page, limit }) => {
    let url = `${process.env.NEXT_PUBLIC_HOST}/api/employees`;

    if (_id) {
      url += `?_id=${_id}`;
    } else if (name) {
      url += `?name=${name}`;
    }
    if ((page && limit && _id) || name) {
      url += `&page=${page}&limit=${limit}`;
    } else if (page && limit) {
      url += `?page=${page}&limit=${limit}`;
    }
    const response = await fetcher(url);
    const data = await response.json();
    return data;
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    data: [],
    currentPage: 1,
    totalPages: "",
    totalCount: "",
    activeCount: "",
    suspendedCount: "",
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.data = action.payload;
        state.currentPage = action.payload.cPage;
        state.totalPages = action.payload.totalPages;
        state.totalCount = action.payload.totalCount;
        state.activeCount = action.payload.activeCount;
        state.suspendedCount = action.payload.suspendedCount;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default employeesSlice.reducer;

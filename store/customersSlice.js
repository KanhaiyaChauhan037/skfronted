import fetcher from "@/utils/fetchWrapper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async () => {
    // const { page, limit } = paginate;
    const response = await fetcher(
      `${process.env.NEXT_PUBLIC_HOST}/api/customers/getAll`
      // `${process.env.NEXT_PUBLIC_HOST}/api/customers/getAll?page=${page}&limit=${limit}`
    );

    const data = await response.json();
    return data;
  }
);

const customersSlice = createSlice({
  name: "customers",
  initialState: {
    data: [],
    currentPage: 1,
    totalPages: "",
    totalCustomers: "",
    totalCompanies: "",
    totalIndustries: "",
    status: "idle",
    error: null,
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.data;
        state.currentPage = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalCustomers = action.payload.totalCustomers;
        state.totalCompanies = action.payload.totalCompanies;
        state.totalIndustries = action.payload.totalIndustries;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default customersSlice.reducer;

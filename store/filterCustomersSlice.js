import fetcher from "@/utils/fetchWrapper";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const filterCustomers = createAsyncThunk(
  "customers/filterCustomers",

  async (params) => {
    const { limit, page, selectedIds = [], ...restParams } = params || {};

    const response = await fetcher(`${process.env.NEXT_PUBLIC_HOST}/api/customers/filter`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page, limit, selectedIds, filters: restParams }),
    });

    const data = await response.json();
    return data;
  }
);

const filterCustomersSlice = createSlice({
  name: "filterCustomers",
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
      .addCase(filterCustomers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(filterCustomers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.filteredData;
        state.currentPage = action.payload.cPage;
        state.totalPages = action.payload.totalPages;
        state.totalCustomers = action.payload.totalCustomers;
        state.totalCompanies = action.payload.totalCompanies;
        state.totalIndustries = action.payload.totalIndustries;
      })
      .addCase(filterCustomers.rejected, (state, action) => {
        state.status = "failed";       
        state.error = action.error.message;
      });
  },
});

export default filterCustomersSlice.reducer;

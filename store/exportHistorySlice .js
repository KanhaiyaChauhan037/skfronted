import { getDecryptedEmployee } from "@/utils/decrypt";
import fetcher from "@/utils/fetchWrapper";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchExportHistory = createAsyncThunk(
  "exportHistory/fetchExportHistory",
  async () => {
    const employee = getDecryptedEmployee();
    const url = `${process.env.NEXT_PUBLIC_HOST}/api/customers/export?employeeId=${employee?.id}`;

    const response = await fetcher(url);
    const data = await response.json();
    return data;
  }
);

const exportHistorySlice = createSlice({
  name: "exportHistory",
  initialState: {
    historyWithFilters: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExportHistory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchExportHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.historyWithFilters = action.payload;
      })
      .addCase(fetchExportHistory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.error;
      });
  },
});

export default exportHistorySlice.reducer;

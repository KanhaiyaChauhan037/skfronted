import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// Async action using createAsyncThunk
export const loginEmployee = createAsyncThunk(
  "employees/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { email, password } = payload;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        // throw new Error(errorData.error);
        return rejectWithValue(errorData);
      }

      const employee = await response.json();
      localStorage.setItem("employee", JSON.stringify(employee));

      return employee;
    } catch (error) {
      // console.log(error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    employee: null,
    error: null,
    loading: false,
  },
  reducers: {
    employeeLogout: (state) => {
      state.employee = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem("employee");
    },
  },
  extraReducers: (builder) => {
    // Handle loading state while async action is in progress
    builder.addCase(loginEmployee.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    // Handle success state after async action is completed successfully
    builder.addCase(loginEmployee.fulfilled, (state, action) => {
      state.loading = false;
      state.employee = action.payload;
      state.error = null;
      toast.success("Login successful");
    });

    // Handle error state after async action has failed
    builder.addCase(loginEmployee.rejected, (state, action) => {
      state.loading = false;
      state.employee = null;
      state.error = action.payload.message;
      toast.error(action.payload.message);
    });
  },
});

export const employeeActions = employeesSlice.actions;

export default employeesSlice.reducer;

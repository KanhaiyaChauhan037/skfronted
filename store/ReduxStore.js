import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./loggedUserSlice";
import customersReducer from "./customersSlice";
import filtersReducer from "./filterCustomersSlice";
import employeesListReducer from "./employeesSlice";
import queryDataReducer from "./queryDataSlice";
import selectedOptionsReducer from "./selectedOptionsSlice";
import selectedByDeptReducer from "./selectedByDeptSlice";
import exportHistoryReducer from "./exportHistorySlice ";
import employeeDataReducer from "./employeeDataSlice";

const store = configureStore({
  reducer: {
    loggedUserData: employeeReducer,
    customersData: customersReducer,
    employeesAllData: employeesListReducer,
    filterData: filtersReducer,
    queryDataAll: queryDataReducer,
    selectedOptions: selectedOptionsReducer,
    selectedByDept: selectedByDeptReducer,
    exportHistory: exportHistoryReducer,
    employeeData: employeeDataReducer,
  },
});

export default store;

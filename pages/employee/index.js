import Dashboard from "@/components/Dashboard";
import { fetchEmployees } from "@/store/employeesSlice";
import { filterCustomers } from "@/store/filterCustomersSlice";
import withAuthorization from "@/utils/withAuthorization";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function AdminDashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchEmployees({}));
  }, [dispatch]);
  useEffect(() => {
    dispatch(filterCustomers({}));
  }, [dispatch]);
  return (
    <>
      <Dashboard />
    </>
  );
}

export default withAuthorization(AdminDashboard, "employee");

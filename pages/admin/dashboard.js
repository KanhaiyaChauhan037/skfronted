import Dashboard from "@/components/Dashboard";
import { useEffect } from "react";
import withAuthorization from "@/utils/withAuthorization";
import { useDispatch } from "react-redux";
import { fetchEmployees } from "@/store/employeesSlice";
import { filterCustomers } from "@/store/filterCustomersSlice";

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

export default withAuthorization(AdminDashboard, "admin");

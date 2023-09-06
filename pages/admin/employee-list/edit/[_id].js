import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import withAuthorization from "@/utils/withAuthorization";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect, useState } from "react";
import NoSSRWrapper from "@/components/NoSsr";
import { useDispatch, useSelector } from "react-redux";
import { fetchEmployeeData } from "@/store/employeeDataSlice";
import { toast } from "react-toastify";
import fetcher from "@/utils/fetchWrapper";

function EditEmployee() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { _id } = router.query;
  const employee = useSelector((state) => state.employeeData?.data?.employees);

  useEffect(() => {
    if (_id) {
      dispatch(fetchEmployeeData({ _id }));
    }
  }, [dispatch, _id]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    contact: "",
    status: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (employee && employee.length > 0) {
      setUser((prevUser) => ({
        ...prevUser,
        name: employee[0].name || prevUser.name,
        email: employee[0].email || prevUser.email,
        contact: employee[0].contact || prevUser.contact,
        status: employee[0].status || prevUser.status,
        role: employee[0].role || prevUser.role,
      }));
    }
  }, [employee]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const { name, email, contact, status, password, role } = user;

  const updateEmployee = (id) => {
    fetcher(`${process.env.NEXT_PUBLIC_HOST}/api/employees/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, contact, status, password, role }),
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("Update request failed");
        } else {
          toast.success("Employee updated successfully");
        }
        return response.json();
      })

      .catch((error) => {
        toast.error("Error updating employee: " + error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateEmployee(_id);
    router.push("/admin/employee-list");
  };

  return (
    <>
      <NoSSRWrapper>
        <div className="nk-app-root">
          <div className="nk-main ">
            {/* sidebar @s */}
            <SideBar />
            {/* wrap @s */}
            <div className="nk-wrap ">
              <Header />
              <div className="nk-content ">
                <div className="container-fluid">
                  <div className="nk-content-inner">
                    <div className="nk-content-body">
                      <div className="components-preview wide-md mx-auto">
                        <div className="nk-block nk-block-lg">
                          <div className="nk-block-head">
                            <div className="nk-block-head-content">
                              <h3 className="title nk-block-title">
                                Edit Employee
                              </h3>
                            </div>
                          </div>
                          <div className="card">
                            <div className="card-inner">
                              <form>
                                <div className="row g-4">
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <label
                                        className="form-label"
                                        htmlFor="full-name-1"
                                      >
                                        Full Name
                                      </label>
                                      <div className="form-control-wrap">
                                        <input
                                          type="text"
                                          name="name"
                                          className="form-control"
                                          id="full-name-1"
                                          value={user.name}
                                          onChange={handleChange}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <label
                                        className="form-label"
                                        htmlFor="email-address-1"
                                      >
                                        Email address
                                      </label>
                                      <div className="form-control-wrap">
                                        <input
                                          type="email"
                                          name="email"
                                          className="form-control"
                                          id="email-address-1"
                                          value={user.email}
                                          onChange={handleChange}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <label
                                        className="form-label"
                                        htmlFor="phone-no-1"
                                      >
                                        Contact
                                      </label>
                                      <div className="form-control-wrap">
                                        <input
                                          type="Number"
                                          name="contact"
                                          className="form-control"
                                          id="phone-no-1"
                                          value={user.contact}
                                          onChange={handleChange}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <label
                                        className="form-label"
                                        htmlFor="password"
                                      >
                                        Password
                                      </label>
                                      <div className="form-control-wrap">
                                        <input
                                          type="password"
                                          name="password"
                                          className="form-control"
                                          id="password"
                                          value={user.password}
                                          onChange={handleChange}
                                          placeholder="Enter new password"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <label className="form-label">Role</label>
                                      <div className="form-control-wrap">
                                        <select
                                          className="form-select js-select2"
                                          name="role"
                                          value={user.role}
                                          onChange={handleChange}
                                        >
                                          <option value="employee">
                                            Employee
                                          </option>
                                          <option value="admin">Admin</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <label className="form-label">
                                        Status
                                      </label>
                                      <div className="form-control-wrap">
                                        <select
                                          className="form-select js-select2"
                                          name="status"
                                          value={user.status}
                                          onChange={handleChange}
                                        >
                                          <option value="active">active</option>
                                          <option value="suspended">
                                            Suspended
                                          </option>
                                        </select>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-12">
                                    <div className="form-group">
                                      <button
                                        type="submit"
                                        className="btn btn-lg btn-primary"
                                        onClick={handleSubmit}
                                      >
                                        Update Employee
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Script src="/assets/js/bundle.js?ver=3.1.2"></Script>
        {/* <Script src="/assets/js/scripts.js?ver=3.1.2"></Script>
      <Script src="./assets/js/charts/chart-ecommerce.js?ver=3.1.2"></Script> */}
      </NoSSRWrapper>
    </>
  );
}

export default withAuthorization(EditEmployee, "admin");
